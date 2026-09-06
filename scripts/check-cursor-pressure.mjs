import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import process from "node:process";
import console from "node:console";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const source = await readFile("src/app/cursor-reveal-poc/CursorRevealPoc.tsx", "utf8");
const shader = (name) => {
  const start = source.indexOf("`", source.indexOf(`const ${name} =`)) + 1;
  return source.slice(start, source.indexOf("`;", start));
};
const server = createServer(async (req, res) => {
  if (req.url.startsWith("/three")) {
    const file = req.url.includes("core") ? "three.core.js" : "three.module.js";
    res.setHeader("Content-Type", "text/javascript");
    res.end(await readFile(`node_modules/three/build/${file}`));
  } else res.end("<html><body></body></html>");
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const result = await page.evaluate(
    async (shaders) => {
      const THREE = await import("/three.module.js");
      const renderer = new THREE.WebGLRenderer();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const scene = new THREE.Scene();
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
      scene.add(quad);
      const size = 96;
      const resolution = { value: new THREE.Vector2(size, size) };
      const target = () =>
        new THREE.WebGLRenderTarget(size, size, {
          type: THREE.FloatType,
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
        });
      const execute = (fragment) => {
        let velocity = target(),
          nextVelocity = target(),
          pressure = target(),
          nextPressure = target();
        const divergence = target();
        const targets = [velocity, nextVelocity, pressure, nextPressure, divergence];
        renderer.setClearColor(0, 1);
        for (const t of targets) {
          renderer.setRenderTarget(t);
          renderer.clear();
        }
        const materials = [];
        const pass = (fragmentShader, uniforms) => {
          const material = new THREE.ShaderMaterial({
            vertexShader: shaders.vertex,
            fragmentShader,
            uniforms,
          });
          materials.push(material);
          return material;
        };
        const render = (material, output) => {
          quad.material = material;
          renderer.setRenderTarget(output);
          renderer.render(scene, camera);
        };
        // Smooth periodic perturbation: no force or input after initialization.
        const seed = pass(
          "varying vec2 vUv; void main(){float v=0.001*sin(vUv.x*6.28318530718*14.0)*sin(vUv.y*6.28318530718*14.0);gl_FragColor=vec4(v,v,0.,1.);}",
          {}
        );
        render(seed, velocity);
        const du = { uVelocity: { value: velocity.texture }, uResolution: resolution };
        const pu = {
          uPressure: { value: pressure.texture },
          uDivergence: { value: divergence.texture },
          uResolution: resolution,
        };
        const vu = {
          uPressure: { value: pressure.texture },
          uVelocity: { value: velocity.texture },
          uResolution: resolution,
        };
        const d = pass(shaders.divergence, du),
          p = pass(fragment, pu),
          v = pass(shaders.projection, vu);
        const pixels = new Float32Array(size * size * 4);
        const rms = () => {
          renderer.readRenderTargetPixels(velocity, 0, 0, size, size, pixels);
          let sum = 0;
          for (let y = 16; y < size - 16; y++)
            for (let x = 16; x < size - 16; x++) {
              const i = (y * size + x) * 4;
              sum += pixels[i] ** 2 + pixels[i + 1] ** 2;
            }
          return Math.sqrt(sum / (size - 32) ** 2);
        };
        const initial = rms();
        let peak = initial;
        for (let frame = 0; frame < 60; frame++) {
          du.uVelocity.value = velocity.texture;
          render(d, divergence);
          for (let i = 0; i < 4; i++) {
            pu.uPressure.value = pressure.texture;
            render(p, nextPressure);
            [pressure, nextPressure] = [nextPressure, pressure];
          }
          vu.uPressure.value = pressure.texture;
          vu.uVelocity.value = velocity.texture;
          render(v, nextVelocity);
          [velocity, nextVelocity] = [nextVelocity, velocity];
          peak = Math.max(peak, rms());
        }
        const result = { initial, final: rms(), peak, growth: peak / initial };
        targets.forEach((t) => t.dispose());
        materials.forEach((m) => m.dispose());
        return result;
      };
      const current = execute(shaders.pressure);
      const corrected = execute(
        shaders.pressure.replace("vec2 px = 1.0 / uResolution;", "vec2 px = 2.0 / uResolution;")
      );
      renderer.dispose();
      return { current, corrected };
    },
    {
      vertex: shader("simulationVertexShader"),
      divergence: shader("divergenceFragmentShader"),
      pressure: shader("pressureFragmentShader"),
      projection: shader("projectionFragmentShader"),
    }
  );
  console.log(JSON.stringify(result, null, 2));
  assert.ok(result.current.initial > 0, "GPU must render the seed");
  assert.ok(result.current.growth < 2, "Pressure must not amplify an unforced perturbation");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
