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
    vec2 originalPosition = vUv;
    vec2 originalVelocity = texture2D(uVelocity, originalPosition).xy;
    vec2 tracedPosition = originalPosition - originalVelocity * uDelta * aspect;
    vec2 tracedVelocity = texture2D(uVelocity, tracedPosition).xy;
    vec2 correctedPosition = tracedPosition + tracedVelocity * uDelta * aspect;
    vec2 error = correctedPosition - originalPosition;
    vec2 compensatedPosition = originalPosition - error * 0.5;
    vec2 compensatedVelocity = texture2D(uVelocity, compensatedPosition).xy;
    vec2 sourceUv = clamp(compensatedPosition - compensatedVelocity * uDelta * aspect, 0.001, 0.999);
    gl_FragColor = vec4(texture2D(uVelocity, sourceUv).xy * 0.96, 0.0, 1.0);
  }
`;

const forceFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity;
  uniform vec2 uResolution;
  uniform vec2 uCursor;
  uniform vec2 uForce;
  varying vec2 vUv;
  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 relative = vUv - uCursor;
    relative.x *= uResolution.x / uResolution.y;
    float radius = 0.082 * (uResolution.x / uResolution.y);
    float influence = max(1.0 - length(relative) / radius, 0.0);
    velocity += uForce * influence * influence;
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
    gl_FragColor = vec4((right - left + up - down) / (2.0 * 0.014), 0.0, 0.0, 1.0);
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
    gl_FragColor = vec4((left + right + down + up) / 5.0 - divergence, 0.0, 0.0, 1.0);
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
    vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(right - left, up - down) * 0.007;
    float speed = length(velocity);
    velocity *= min(1.0, 1.2 / max(speed, 0.0001));
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const velocityEncodeFragmentShader = /* glsl */ `
  uniform sampler2D uVelocity;
  varying vec2 vUv;
  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    float speed = length(velocity);
    vec2 direction = velocity * 0.5 + 0.5;
    vec3 encoded = mix(vec3(1.0), vec3(direction, 1.0), speed);
    gl_FragColor = vec4(encoded, 1.0);
  }
`;

const maskExtractionFragmentShader = /* glsl */ `
  uniform sampler2D uCursorEffect;
  uniform vec2 uTexel;
  varying vec2 vUv;

  float influenceAt(vec2 uv) {
    vec3 cursorEffect = texture2D(uCursorEffect, uv).rgb;
    return length(vec3(1.0) - cursorEffect);
  }

  void main() {
    float center = influenceAt(vUv) * 0.5;
    float horizontal = (influenceAt(vUv + vec2(uTexel.x, 0.0)) + influenceAt(vUv - vec2(uTexel.x, 0.0))) * 0.125;
    float vertical = (influenceAt(vUv + vec2(0.0, uTexel.y)) + influenceAt(vUv - vec2(0.0, uTexel.y))) * 0.125;
    float influence = min(center + horizontal + vertical, 1.0);
    float mask = smoothstep(0.075, 0.28, influence);
    gl_FragColor = vec4(vec3(mask), 1.0);
  }
`;

const compositionFragmentShader = /* glsl */ `
  uniform sampler2D uImageA;
  uniform sampler2D uImageB;
  uniform sampler2D uRevealTexture;
  uniform float uDebugMask;
  varying vec2 vUv;
  void main() {
    float reveal = texture2D(uRevealTexture, vUv).r;
    if (uDebugMask > 0.5) {
      gl_FragColor = vec4(vec3(reveal), 1.0);
      #include <colorspace_fragment>
      return;
    }
    vec3 base = texture2D(uImageA, vUv).rgb;
    vec3 revealed = texture2D(uImageB, vUv).rgb;
    gl_FragColor = vec4(mix(base, revealed, reveal), 1.0);
    #include <colorspace_fragment>
  }
`;

type CursorState = {
  current: THREE.Vector2;
  previous: THREE.Vector2;
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
        type: THREE.FloatType,
      });
    const targetA = createTarget();
    const targetB = createTarget();
    const divergenceTarget = createTarget();
    const pressureA = createTarget();
    const pressureB = createTarget();
    const encodedCursorTarget = new THREE.WebGLRenderTarget(640, 360, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    });
    const revealMaskTarget = new THREE.WebGLRenderTarget(640, 360, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    });
    let velocityRead = targetA;
    let velocityWrite = targetB;
    let pressureRead = pressureA;
    let pressureWrite = pressureB;
    const simulationTargets = [targetA, targetB, divergenceTarget, pressureA, pressureB];
    const clearSimulationTargets = () => {
      renderer.setClearColor(0x000000, 1);
      simulationTargets.forEach((target) => {
        renderer.setRenderTarget(target);
        renderer.clear();
      });
      renderer.setRenderTarget(null);
    };
    clearSimulationTargets();

    const cursor: CursorState = {
      current: new THREE.Vector2(-1, -1),
      previous: new THREE.Vector2(-1, -1),
      active: false,
    };

    const advectionUniforms = {
      uVelocity: { value: velocityRead.texture },
      uResolution: { value: new THREE.Vector2(640, 360) },
      uDelta: { value: 1 / 60 },
    };
    const forceUniforms = {
      uVelocity: { value: velocityRead.texture },
      uResolution: advectionUniforms.uResolution,
      uCursor: { value: cursor.current },
      uForce: { value: new THREE.Vector2() },
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
    const velocityEncodeUniforms = { uVelocity: { value: velocityRead.texture } };
    const velocityEncodeMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: velocityEncodeFragmentShader,
      uniforms: velocityEncodeUniforms,
    });
    const maskExtractionUniforms = {
      uCursorEffect: { value: encodedCursorTarget.texture },
      uTexel: { value: new THREE.Vector2(1 / 640, 1 / 360) },
    };
    const maskExtractionMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: maskExtractionFragmentShader,
      uniforms: maskExtractionUniforms,
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
      uRevealTexture: { value: revealMaskTarget.texture },
      uDebugMask: { value: new URLSearchParams(window.location.search).has("debugMask") ? 1 : 0 },
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
      const simulationWidth = Math.max(1, Math.round(width * 0.1));
      const simulationHeight = Math.max(1, Math.round(height * 0.1));
      simulationTargets.forEach((target) => target.setSize(simulationWidth, simulationHeight));
      encodedCursorTarget.setSize(width, height);
      revealMaskTarget.setSize(width, height);
      maskExtractionUniforms.uTexel.value.set(1 / width, 1 / height);
      advectionUniforms.uResolution.value.set(simulationWidth, simulationHeight);
      clearSimulationTargets();
    };
    const onPointerMove = (event: PointerEvent) => {
      cursor.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
      if (!cursor.active) {
        cursor.previous.copy(cursor.current);
      }
      cursor.active = true;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let elapsed = 0;
    const render = () => {
      elapsed += Math.min(clock.getDelta(), 0.05);
      while (elapsed >= 1 / 60) {
        advectionUniforms.uVelocity.value = velocityRead.texture;
        advectionUniforms.uDelta.value = 0.014;
        simulationQuad.material = advectionMaterial;
        renderer.setRenderTarget(velocityWrite);
        renderer.render(simulationScene, camera);
        [velocityRead, velocityWrite] = [velocityWrite, velocityRead];

        forceUniforms.uVelocity.value = velocityRead.texture;
        forceUniforms.uForce.value.copy(cursor.current).sub(cursor.previous).multiplyScalar(50);
        cursor.previous.copy(cursor.current);
        simulationQuad.material = forceMaterial;
        renderer.setRenderTarget(velocityWrite);
        renderer.render(simulationScene, camera);
        [velocityRead, velocityWrite] = [velocityWrite, velocityRead];

        divergenceUniforms.uVelocity.value = velocityRead.texture;
        simulationQuad.material = divergenceMaterial;
        renderer.setRenderTarget(divergenceTarget);
        renderer.render(simulationScene, camera);

        simulationQuad.material = pressureMaterial;
        for (let iteration = 0; iteration < 4; iteration += 1) {
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
        elapsed %= 1 / 60;
      }

      velocityEncodeUniforms.uVelocity.value = velocityRead.texture;
      simulationQuad.material = velocityEncodeMaterial;
      renderer.setRenderTarget(encodedCursorTarget);
      renderer.render(simulationScene, camera);
      maskExtractionUniforms.uCursorEffect.value = encodedCursorTarget.texture;
      simulationQuad.material = maskExtractionMaterial;
      renderer.setRenderTarget(revealMaskTarget);
      renderer.render(simulationScene, camera);
      compositionUniforms.uRevealTexture.value = revealMaskTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(compositionScene, camera);
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
      velocityEncodeMaterial.dispose();
      maskExtractionMaterial.dispose();
      compositionMaterial.dispose();
      targetA.dispose();
      targetB.dispose();
      divergenceTarget.dispose();
      pressureA.dispose();
      pressureB.dispose();
      encodedCursorTarget.dispose();
      revealMaskTarget.dispose();
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
