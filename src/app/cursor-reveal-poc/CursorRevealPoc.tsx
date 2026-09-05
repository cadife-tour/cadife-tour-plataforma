"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./cursor-reveal-poc.module.css";

const simulationVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

// This pass owns the persistent reveal texture. It reads the previous target,
// dissipates and gently diffuses it, then deposits one directional, irregular splat.
const simulationFragmentShader = /* glsl */ `
  uniform sampler2D uPrevious;
  uniform vec2 uResolution;
  uniform vec2 uFrom;
  uniform vec2 uTo;
  uniform vec2 uVelocity;
  uniform float uStrength;
  uniform float uDelta;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
  }

  void main() {
    vec2 px = 1.0 / uResolution;
    float previous = texture2D(uPrevious, vUv).r;
    float neighborhood = (
      texture2D(uPrevious, vUv + vec2(px.x, 0.0)).r +
      texture2D(uPrevious, vUv - vec2(px.x, 0.0)).r +
      texture2D(uPrevious, vUv + vec2(0.0, px.y)).r +
      texture2D(uPrevious, vUv - vec2(0.0, px.y)).r
    ) * 0.25;
    float memory = mix(previous, neighborhood, 0.12) * exp(-0.75 * uDelta);

    vec2 segment = uTo - uFrom;
    float segmentLength = max(length(segment), 0.0001);
    vec2 direction = segment / segmentLength;
    vec2 perpendicular = vec2(-direction.y, direction.x);
    vec2 midpoint = (uFrom + uTo) * 0.5;
    vec2 relative = vUv - midpoint;
    float along = dot(relative, direction);
    float across = dot(relative, perpendicular);
    float speed = clamp(length(uVelocity) * 24.0, 0.0, 1.0);
    float halfLength = segmentLength * 0.5 + mix(0.022, 0.105, speed);
    float radius = mix(0.050, 0.082, speed);
    float edgeNoise = (noise(vUv * 46.0 + uTo * 19.0) - 0.5) * radius * 0.35;
    float capsule = max(abs(along) - halfLength, 0.0);
    float distanceToRibbon = length(vec2(capsule, across * mix(1.0, 0.62, speed))) + edgeNoise;
    float splat = 1.0 - smoothstep(radius * 0.35, radius, distanceToRibbon);
    splat *= 0.82 + 0.18 * noise(vUv * 90.0 + vec2(uVelocity.y, -uVelocity.x) * 100.0);

    gl_FragColor = vec4(max(memory, splat * uStrength), 0.0, 0.0, 1.0);
  }
`;

const compositionFragmentShader = /* glsl */ `
  uniform sampler2D uImageA;
  uniform sampler2D uImageB;
  uniform sampler2D uRevealTexture;
  varying vec2 vUv;
  void main() {
    float trail = texture2D(uRevealTexture, vUv).r;
    float reveal = smoothstep(0.14, 0.60, trail);
    vec3 base = texture2D(uImageA, vUv).rgb;
    vec3 revealed = texture2D(uImageB, vUv).rgb;
    gl_FragColor = vec4(mix(base, revealed, reveal), 1.0);
  }
`;

type CursorState = { current: THREE.Vector2; previous: THREE.Vector2; velocity: THREE.Vector2; active: boolean };

export default function CursorRevealPoc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const simulationScene = new THREE.Scene();
    const compositionScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const createTarget = () => new THREE.WebGLRenderTarget(640, 360, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    });
    const targetA = createTarget();
    const targetB = createTarget();
    let readTarget = targetA;
    let writeTarget = targetB;
    renderer.setRenderTarget(readTarget);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderer.setRenderTarget(null);

    const cursor: CursorState = {
      current: new THREE.Vector2(-1, -1),
      previous: new THREE.Vector2(-1, -1),
      velocity: new THREE.Vector2(),
      active: false,
    };
    const easedCursor = new THREE.Vector2(-1, -1);
    const lastEasedCursor = new THREE.Vector2(-1, -1);
    let lastPointerAt = 0;

    const simulationUniforms = {
      uPrevious: { value: readTarget.texture },
      uResolution: { value: new THREE.Vector2(640, 360) },
      uFrom: { value: lastEasedCursor },
      uTo: { value: easedCursor },
      uVelocity: { value: cursor.velocity },
      uStrength: { value: 0 },
      uDelta: { value: 1 / 60 },
    };
    const simulationMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: simulationUniforms,
    });
    simulationScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial));

    const loader = new THREE.TextureLoader();
    const imageA = loader.load("/demo-ln4/office.png");
    const imageB = loader.load("/demo-ln4/paradise.png");
    imageA.colorSpace = THREE.SRGBColorSpace;
    imageB.colorSpace = THREE.SRGBColorSpace;
    const compositionUniforms = { uImageA: { value: imageA }, uImageB: { value: imageB }, uRevealTexture: { value: readTarget.texture } };
    const compositionMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: compositionFragmentShader,
      uniforms: compositionUniforms,
    });
    compositionScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositionMaterial));

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      const simulationHeight = 420;
      const simulationWidth = Math.max(1, Math.round(simulationHeight * (width / height)));
      [targetA, targetB].forEach((target) => target.setSize(simulationWidth, simulationHeight));
      simulationUniforms.uResolution.value.set(simulationWidth, simulationHeight);
    };
    const onPointerMove = (event: PointerEvent) => {
      cursor.previous.copy(cursor.current);
      cursor.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
      if (!cursor.active) cursor.previous.copy(cursor.current);
      cursor.active = true;
      lastPointerAt = performance.now();
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const isMoving = cursor.active && performance.now() - lastPointerAt < 80;
      if (isMoving) {
        cursor.velocity.copy(cursor.current).sub(cursor.previous).multiplyScalar(1 / Math.max(delta, 0.001));
        easedCursor.lerp(cursor.current, 1.0 - Math.exp(-18 * delta));
      }
      simulationUniforms.uPrevious.value = readTarget.texture;
      simulationUniforms.uFrom.value.copy(lastEasedCursor);
      simulationUniforms.uTo.value.copy(easedCursor);
      simulationUniforms.uVelocity.value.copy(cursor.velocity);
      simulationUniforms.uStrength.value = isMoving ? 1 : 0;
      simulationUniforms.uDelta.value = delta;
      renderer.setRenderTarget(writeTarget);
      renderer.render(simulationScene, camera);
      renderer.setRenderTarget(null);
      [readTarget, writeTarget] = [writeTarget, readTarget];
      compositionUniforms.uRevealTexture.value = readTarget.texture;
      renderer.render(compositionScene, camera);
      lastEasedCursor.copy(easedCursor);
      cursor.previous.copy(cursor.current);
      cursor.velocity.multiplyScalar(0.86);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      imageA.dispose(); imageB.dispose(); simulationMaterial.dispose(); compositionMaterial.dispose();
      targetA.dispose(); targetB.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive cursor reveal proof of concept" />;
}
