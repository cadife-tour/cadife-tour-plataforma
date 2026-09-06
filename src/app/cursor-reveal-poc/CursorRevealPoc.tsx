"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./cursor-reveal-poc.module.css";

const simulationVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const advectionFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity;
  uniform vec2 uResolution;
  uniform float uDelta;
  varying vec2 vUv;
  void main() {
    vec2 aspect = vec2(max(uResolution.x, uResolution.y)) / uResolution;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 sourceUv = clamp(vUv - velocity * uDelta * aspect, 0.001, 0.999);
    gl_FragColor = vec4(texture2D(uVelocity, sourceUv).xy * exp(-1.55 * uDelta), 0.0, 1.0);
  }
`;

const forceFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity;
  uniform vec2 uResolution;
  uniform vec2 uCursor;
  uniform vec2 uForce;
  uniform float uIsMoving;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 relative = vUv - uCursor;
    relative.x *= uResolution.x / uResolution.y;
    float radius = 0.105 + clamp(length(uForce) * 0.20, 0.0, 0.035);
    float irregularity = (hash(floor(vUv * 80.0)) - 0.5) * 0.012;
    float influence = 1.0 - smoothstep(radius * 0.28, radius, length(relative) + irregularity);
    velocity += uForce * influence * uIsMoving;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const divergenceFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity; uniform vec2 uResolution; varying vec2 vUv;
  void main() {
    vec2 px = 1.0 / uResolution;
    float left = texture2D(uVelocity, vUv - vec2(px.x, 0.0)).x;
    float right = texture2D(uVelocity, vUv + vec2(px.x, 0.0)).x;
    float down = texture2D(uVelocity, vUv - vec2(0.0, px.y)).y;
    float up = texture2D(uVelocity, vUv + vec2(0.0, px.y)).y;
    gl_FragColor = vec4((right - left + up - down) * 0.5, 0.0, 0.0, 1.0);
  }
`;

const pressureFragmentShader = /* glsl */ `
  uniform sampler2D uPressure; uniform sampler2D uDivergence; uniform vec2 uResolution; varying vec2 vUv;
  void main() {
    vec2 px = 1.0 / uResolution;
    float left = texture2D(uPressure, vUv - vec2(px.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(px.x, 0.0)).x;
    float down = texture2D(uPressure, vUv - vec2(0.0, px.y)).x;
    float up = texture2D(uPressure, vUv + vec2(0.0, px.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((left + right + down + up - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const projectionFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity; uniform sampler2D uPressure; uniform vec2 uResolution; varying vec2 vUv;
  void main() {
    vec2 px = 1.0 / uResolution;
    float left = texture2D(uPressure, vUv - vec2(px.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(px.x, 0.0)).x;
    float down = texture2D(uPressure, vUv - vec2(0.0, px.y)).x;
    float up = texture2D(uPressure, vUv + vec2(0.0, px.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(right - left, up - down) * 0.5;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const compositionFragmentShader = /* glsl */ `
  uniform sampler2D uImageA;
  uniform sampler2D uImageB;
  uniform sampler2D uRevealTexture;
  varying vec2 vUv;
  void main() {
    vec4 simulation = texture2D(uRevealTexture, vUv);
    vec2 flow = simulation.rg;
    float flowStrength = length(flow);
    float turbulentEdge = sin(vUv.x * 55.0 + flow.y * 140.0) * min(flowStrength, 0.008);
    float reveal = smoothstep(0.002, 0.015, flowStrength + turbulentEdge);
    vec3 base = texture2D(uImageA, vUv).rgb;
    vec3 revealed = texture2D(uImageB, clamp(vUv - flow * 0.12, 0.001, 0.999)).rgb;
    gl_FragColor = vec4(mix(base, revealed, reveal), 1.0);
    #include <colorspace_fragment>
  }
`;

type CursorState = {
  current: THREE.Vector2;
  previous: THREE.Vector2;
  velocity: THREE.Vector2;
  active: boolean;
};

export default function CursorRevealPoc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const simulationScene = new THREE.Scene();
    const compositionScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const createTarget = () =>
      new THREE.WebGLRenderTarget(640, 360, {
        depthBuffer: false,
        stencilBuffer: false,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
        type: THREE.HalfFloatType,
      });
    const targetA = createTarget();
    const targetB = createTarget();
    const divergenceTarget = createTarget();
    const pressureA = createTarget();
    const pressureB = createTarget();
    let velocityRead = targetA;
    let velocityWrite = targetB;
    let pressureRead = pressureA;
    let pressureWrite = pressureB;
    renderer.setClearColor(0x000000, 1);
    [targetA, targetB, divergenceTarget, pressureA, pressureB].forEach((target) => {
      renderer.setRenderTarget(target);
      renderer.clear();
    });
    renderer.setRenderTarget(null);

    const cursor: CursorState = {
      current: new THREE.Vector2(-1, -1),
      previous: new THREE.Vector2(-1, -1),
      velocity: new THREE.Vector2(),
      active: false,
    };
    const easedCursor = new THREE.Vector2(-1, -1);
    const lastEasedCursor = new THREE.Vector2(-1, -1);

    const advectionUniforms = {
      uVelocity: { value: velocityRead.texture },
      uResolution: { value: new THREE.Vector2(640, 360) },
      uDelta: { value: 1 / 60 },
    };
    const forceUniforms = {
      uVelocity: { value: velocityRead.texture },
      uResolution: advectionUniforms.uResolution,
      uCursor: { value: easedCursor },
      uForce: { value: cursor.velocity },
      uIsMoving: { value: 0 },
    };
    const divergenceUniforms = {
      uVelocity: { value: velocityRead.texture },
      uResolution: advectionUniforms.uResolution,
    };
    const pressureUniforms = {
      uPressure: { value: pressureRead.texture },
      uDivergence: { value: divergenceTarget.texture },
      uResolution: advectionUniforms.uResolution,
    };
    const projectionUniforms = {
      uVelocity: { value: velocityRead.texture },
      uPressure: { value: pressureRead.texture },
      uResolution: advectionUniforms.uResolution,
    };
    const advectionMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: advectionFragmentShader,
      uniforms: advectionUniforms,
    });
    const forceMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: forceFragmentShader,
      uniforms: forceUniforms,
    });
    const divergenceMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: divergenceFragmentShader,
      uniforms: divergenceUniforms,
    });
    const pressureMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: pressureFragmentShader,
      uniforms: pressureUniforms,
    });
    const projectionMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: projectionFragmentShader,
      uniforms: projectionUniforms,
    });
    const simulationQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), advectionMaterial);
    simulationScene.add(simulationQuad);

    const loader = new THREE.TextureLoader();
    // The unedited source images keep the POC's colour comparison trustworthy.
    const imageA = loader.load("/demo-ln4/office-original.png");
    const imageB = loader.load("/demo-ln4/paradise-original.png");
    imageA.colorSpace = THREE.SRGBColorSpace;
    imageB.colorSpace = THREE.SRGBColorSpace;
    const compositionUniforms = {
      uImageA: { value: imageA },
      uImageB: { value: imageB },
      uRevealTexture: { value: velocityRead.texture },
    };
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
      [targetA, targetB, divergenceTarget, pressureA, pressureB].forEach((target) =>
        target.setSize(simulationWidth, simulationHeight)
      );
      advectionUniforms.uResolution.value.set(simulationWidth, simulationHeight);
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
        cursor.velocity
          .copy(easedCursor)
          .sub(lastEasedCursor)
          .multiplyScalar(1 / Math.max(delta, 0.001));
      } else {
        cursor.velocity.multiplyScalar(0.75);
      }
      advectionUniforms.uVelocity.value = velocityRead.texture;
      advectionUniforms.uDelta.value = delta;
      simulationQuad.material = advectionMaterial;
      renderer.setRenderTarget(velocityWrite);
      renderer.render(simulationScene, camera);
      [velocityRead, velocityWrite] = [velocityWrite, velocityRead];

      forceUniforms.uVelocity.value = velocityRead.texture;
      forceUniforms.uCursor.value.copy(easedCursor);
      forceUniforms.uForce.value.copy(cursor.velocity).multiplyScalar(0.0045).clampLength(0, 0.13);
      forceUniforms.uIsMoving.value = isMoving ? 1 : 0;
      simulationQuad.material = forceMaterial;
      renderer.setRenderTarget(velocityWrite);
      renderer.render(simulationScene, camera);
      [velocityRead, velocityWrite] = [velocityWrite, velocityRead];

      divergenceUniforms.uVelocity.value = velocityRead.texture;
      simulationQuad.material = divergenceMaterial;
      renderer.setRenderTarget(divergenceTarget);
      renderer.render(simulationScene, camera);

      simulationQuad.material = pressureMaterial;
      for (let iteration = 0; iteration < 12; iteration += 1) {
        pressureUniforms.uPressure.value = pressureRead.texture;
        renderer.setRenderTarget(pressureWrite);
        renderer.render(simulationScene, camera);
        [pressureRead, pressureWrite] = [pressureWrite, pressureRead];
      }

      projectionUniforms.uVelocity.value = velocityRead.texture;
      projectionUniforms.uPressure.value = pressureRead.texture;
      simulationQuad.material = projectionMaterial;
      renderer.setRenderTarget(velocityWrite);
      renderer.render(simulationScene, camera);
      [velocityRead, velocityWrite] = [velocityWrite, velocityRead];

      compositionUniforms.uRevealTexture.value = velocityRead.texture;
      renderer.setRenderTarget(null);
      renderer.render(compositionScene, camera);
      lastEasedCursor.copy(easedCursor);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      imageA.dispose();
      imageB.dispose();
      advectionMaterial.dispose();
      forceMaterial.dispose();
      divergenceMaterial.dispose();
      pressureMaterial.dispose();
      projectionMaterial.dispose();
      compositionMaterial.dispose();
      targetA.dispose();
      targetB.dispose();
      divergenceTarget.dispose();
      pressureA.dispose();
      pressureB.dispose();
      simulationQuad.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Interactive cursor reveal proof of concept"
    />
  );
}
