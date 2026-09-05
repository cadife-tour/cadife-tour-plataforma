"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface WebGLRevealHeroProps {
  imageOfficeSrc?: string;
  imageParadiseSrc?: string;
}

/**
 * WebGLRevealHero:
 * Shader WebGL customizado (Three.js) com física inercial líquida (idêntico ao shader do Lando Norris / OFF+BRAND).
 * O cursor do mouse cria uma trilha de fluido/onda orgânica com ruído simplex suave que revela
 * a foto da praia por baixo da foto do escritório.
 * Quando o mouse para ou não está sobre a tela, uma onda sutil orgânica mantém a Hero viva.
 */
export const WebGLRevealHero: React.FC<WebGLRevealHeroProps> = ({
  imageOfficeSrc = "/demo-ln4/office.png",
  imageParadiseSrc = "/demo-ln4/paradise.png",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Cena, Câmera Ortográfica e Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Carregador de Texturas com filtragem linear sedosa e color space correto sRGB
    const textureLoader = new THREE.TextureLoader();
    const texOffice = textureLoader.load(imageOfficeSrc);
    const texParadise = textureLoader.load(imageParadiseSrc);

    texOffice.colorSpace = THREE.SRGBColorSpace;
    texParadise.colorSpace = THREE.SRGBColorSpace;
    texOffice.wrapS = THREE.ClampToEdgeWrapping;
    texOffice.wrapT = THREE.ClampToEdgeWrapping;
    texParadise.wrapS = THREE.ClampToEdgeWrapping;
    texParadise.wrapT = THREE.ClampToEdgeWrapping;
    texOffice.minFilter = THREE.LinearFilter;
    texOffice.magFilter = THREE.LinearFilter;
    texParadise.minFilter = THREE.LinearFilter;
    texParadise.magFilter = THREE.LinearFilter;

    // 3. Mouse interativo com interpolação suave (lerp amortecido)
    const mouse = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      speed: 0,
      targetSpeed: 0,
      isHovered: false,
    };

    // 4. Uniforms do Shader
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTextureOffice: { value: texOffice },
      uTextureParadise: { value: texParadise },
    };

    // 5. Shader Material inspirado no GLSL do Lando Norris (noise + fluid displacement + organic mask)
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uVelocity;
        uniform float uHover;
        uniform vec2 uResolution;
        uniform sampler2D uTextureOffice;
        uniform sampler2D uTextureParadise;
        varying vec2 vUv;

        // Simplex noise 2D
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          // Aspect ratio cover calculation com as dimensões nativas da imagem (1024x572)
          float aspectScreen = uResolution.x / uResolution.y;
          float aspectImg = 1024.0 / 572.0;
          vec2 uv = vUv;

          if (aspectScreen > aspectImg) {
            float scale = aspectScreen / aspectImg;
            uv.y = (uv.y - 0.5) * (1.0 / scale) + 0.5;
          } else {
            float scale = aspectImg / aspectScreen;
            uv.x = (uv.x - 0.5) * (1.0 / scale) + 0.5;
          }
          uv = clamp(uv, vec2(0.001), vec2(0.999));

          // Exact Lando Norris coordinate normalization
          vec2 mouseAspect = uMouse;
          vec2 uvAspect = vUv;
          uvAspect.x *= aspectScreen;
          mouseAspect.x *= aspectScreen;

          // Distância e coordenadas em relação ao cursor
          float dy = uvAspect.y - mouseAspect.y;
          float dx = uvAspect.x - mouseAspect.x;

          // Curvatura e ângulo helicoidal idênticos à Foto 1 do Lando Norris
          // As faixas possuem uma ligeira curvatura cilíndrica/helicoidal (sin)
          float sliceAngle = 0.22;
          float curve = sin(dx * 2.8) * 0.04;
          float projected = (dy - dx * sliceAngle) - curve;

          // Três faixas helicoidais cortadas exatamente como na Foto 1:
          // 1. Faixa principal central passando pelo cursor (espessura generosa revelando a boca/olhos)
          float ribbon1 = step(abs(projected), 0.065);

          // 2. Faixa superior inclinada (cortando a testa/capacete como na foto)
          float ribbon2 = step(abs(projected - 0.155), 0.048);

          // 3. Faixa no topo da cabeça
          float ribbon3 = step(abs(projected - 0.285), 0.038);

          // 4. Faixa inferior sutil no queixo/pescoço
          float ribbon4 = step(abs(projected + 0.145), 0.032);

          // Extensão horizontal das fatias que atravessam o rosto com fade suave nas bordas externas
          float hLimit = 0.60 + uVelocity * 0.12;
          float hMask = smoothstep(hLimit, hLimit - 0.12, abs(dx));

          // Máscara combinada das fatias (1.0 = revela o paraíso, 0.0 = escritório)
          float sliceMask = clamp((ribbon1 + ribbon2 + ribbon3 + ribbon4) * hMask * uHover, 0.0, 1.0);

          // Amostragem das texturas sRGB originais
          vec4 colorOffice = texture2D(uTextureOffice, uv);
          vec4 colorParadise = texture2D(uTextureParadise, uv);

          // Cores 100% puras e originais (sem filtro ou alteração)
          vec3 officeRgb = colorOffice.rgb;
          vec3 paradiseRgb = colorParadise.rgb;

          // Mistura reveladora
          vec3 finalRgb = mix(officeRgb, paradiseRgb, sliceMask);

          gl_FragColor = vec4(finalRgb, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. Redimensionamento Responsivo
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 7. Eventos do Mouse / Touch
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (!e.touches || !e.touches[0]) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = container.getBoundingClientRect();

      const nx = (clientX - rect.left) / rect.width;
      const ny = 1.0 - (clientY - rect.top) / rect.height; // Inversão para o sistema de coordenadas WebGL

      const dx = nx - mouse.targetX;
      const dy = ny - mouse.targetY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouse.targetX = nx;
      mouse.targetY = ny;
      mouse.targetSpeed = Math.min(speed * 12.0, 1.0);
      mouse.isHovered = true;
    };

    const onPointerEnter = () => {
      mouse.isHovered = true;
    };

    const onPointerLeave = () => {
      mouse.isHovered = false;
      mouse.targetSpeed = 0;
    };

    container.addEventListener("mouseenter", onPointerEnter);
    container.addEventListener("mousemove", onPointerMove, { passive: true });
    container.addEventListener("touchmove", onPointerMove, { passive: true });
    container.addEventListener("mouseleave", onPointerLeave);

    // 8. Loop de Renderização Contínuo (60fps) com Interpolação Inercial
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Interpolação suave (lerp) da posição e da velocidade do cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.09;
      mouse.y += (mouse.targetY - mouse.y) * 0.09;
      mouse.speed += (mouse.targetSpeed - mouse.speed) * 0.08;
      mouse.targetSpeed *= 0.94; // Amortecimento de inércia

      const targetHover = mouse.isHovered ? 1.0 : 0.0;
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.1;

      uniforms.uTime.value = elapsedTime;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uVelocity.value = mouse.speed;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 9. Limpeza ao desmontar
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", onPointerEnter);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("touchmove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texOffice.dispose();
      texParadise.dispose();
    };
  }, [imageOfficeSrc, imageParadiseSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
    </div>
  );
};
