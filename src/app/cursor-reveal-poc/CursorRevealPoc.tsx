"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./cursor-reveal-poc.module.css";

const simulationVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

// The two ping-pong targets carry a velocity field (RG) and reveal density (B).
// Each frame advects that state, dissipates it, then injects cursor force locally.
const simulationFragmentShader = /* glsl */ `
  uniform sampler2D uPrevious;
  uniform vec2 uResolution;
  uniform vec2 uCursor;
  uniform vec2 uForce;
  uniform float uIsMoving;
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
    vec2 storedVelocity = texture2D(uPrevious, vUv).rg * 2.0 - 1.0;
    vec2 sourceUv = clamp(vUv - storedVelocity * uDelta * 0.32, px, 1.0 - px);
    vec4 transported = texture2D(uPrevious, sourceUv);
    vec2 velocity = (transported.rg * 2.0 - 1.0) * exp(-2.3 * uDelta);
    float density = transported.b * exp(-0.58 * uDelta);

    vec2 relative = vUv - uCursor;
    relative.x *= uResolution.x / uResolution.y;
    float radius = 0.125 + clamp(length(uForce) * 0.020, 0.0, 0.035);
    float edge = length(relative) + (noise(vUv * 38.0 + uCursor * 27.0) - 0.5) * 0.018;
    float influence = 1.0 - smoothstep(radius * 0.35, radius, edge);
    float wake = 0.65 + 0.35 * noise(vUv * 72.0 + uForce * 9.0);
    velocity += uForce * influence * uIsMoving;
    density = max(density, influence * wake * uIsMoving);

    gl_FragColor = vec4(velocity * 0.5 + 0.5, density, 1.0);
  }
`;

const compositionFragmentShader = /* glsl */ `
  uniform sampler2D uImageA;
  uniform sampler2D uImageB;
  uniform sampler2D uRevealTexture;
  varying vec2 vUv;
  void main() {
    vec4 simulation = texture2D(uRevealTexture, vUv);
    vec2 flow = simulation.rg * 2.0 - 1.0;
    float reveal = smoothstep(0.10, 0.52, simulation.b);
    vec3 base = texture2D(uImageA, vUv).rgb;
    vec3 revealed = texture2D(uImageB, clamp(vUv - flow * (0.050 + reveal * 0.075), 0.001, 0.999)).rgb;
    gl_FragColor = vec4(mix(base, revealed, reveal), 1.0);
    #include <colorspace_fragment>
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
    // Neutral RG encodes zero flow; B starts with no reveal.
    renderer.setClearColor(new THREE.Color(0.5, 0.5, 0), 1);
    renderer.setRenderTarget(targetA);
    renderer.clear();
    renderer.setRenderTarget(targetB);
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

    const simulationUniforms = {
      uPrevious: { value: readTarget.texture },
      uResolution: { value: new THREE.Vector2(640, 360) },
      uCursor: { value: easedCursor },
      uForce: { value: cursor.velocity },
      uIsMoving: { value: 0 },
      uDelta: { value: 1 / 60 },
    };
    const simulationMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: simulationUniforms,
    });
    simulationScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial));

    const loader = new THREE.TextureLoader();
    // The unedited source images keep the POC's colour comparison trustworthy.
    const imageA = loader.load("/demo-ln4/office-original.png");
    const imageB = loader.load("/demo-ln4/paradise-original.png");
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
      if (!cursor.active) {
        cursor.previous.copy(cursor.current);
        easedCursor.copy(cursor.current);
        lastEasedCursor.copy(cursor.current);
      }
      cursor.active = true;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const remainingDistance = easedCursor.distanceTo(cursor.current);
      const isMoving = cursor.active && remainingDistance > 0.0005;
      if (isMoving) {
        easedCursor.lerp(cursor.current, 1.0 - Math.exp(-7 * delta));
        cursor.velocity.copy(easedCursor).sub(lastEasedCursor).multiplyScalar(1 / Math.max(delta, 0.001));
      } else {
        cursor.velocity.multiplyScalar(0.75);
      }
      simulationUniforms.uPrevious.value = readTarget.texture;
      simulationUniforms.uCursor.value.copy(easedCursor);
      simulationUniforms.uForce.value.copy(cursor.velocity).multiplyScalar(0.0025).clampLength(0, 0.085);
      simulationUniforms.uIsMoving.value = isMoving ? 1 : 0;
      simulationUniforms.uDelta.value = delta;
      renderer.setRenderTarget(writeTarget);
      renderer.render(simulationScene, camera);
      renderer.setRenderTarget(null);
      [readTarget, writeTarget] = [writeTarget, readTarget];
      compositionUniforms.uRevealTexture.value = readTarget.texture;
      renderer.render(compositionScene, camera);
      lastEasedCursor.copy(easedCursor);
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
