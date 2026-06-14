import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT_FROM = 0x5923a0;
const ACCENT_TO = 0xcd42a8;

interface Hero3DProps {
  theme: "dark" | "light";
}

/**
 * Vanilla Three.js voxel scene (no react-three-fiber) — a Minecraft-style
 * pixel pen (UI/UX) and a blocky ">" chevron (dev) built entirely from cubes,
 * which the user can drag to spin. Cube-only geometry avoids the bevel/normal
 * glitching of the previous extruded version and matches the pixel theme.
 */
export function Hero3D({ theme }: Hero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getW = () => mount.clientWidth || 1;
    const getH = () => mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, getW() / getH(), 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(getW(), getH());
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    // ---- lights ----
    scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.7 : 1.0));
    const key = new THREE.DirectionalLight(0xffffff, dark ? 1.5 : 2.1);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim1 = new THREE.PointLight(ACCENT_TO, dark ? 4 : 2.5);
    rim1.position.set(-5, -2, 3);
    scene.add(rim1);
    const rim2 = new THREE.PointLight(ACCENT_FROM, 2);
    rim2.position.set(3, 2, -4);
    scene.add(rim2);

    // ---- tracked resources ----
    const disposables: { dispose: () => void }[] = [];
    const voxelMat = (color: number, emissive?: number, ei = 0) => {
      const m = new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.7, flatShading: true });
      if (emissive !== undefined) {
        m.emissive = new THREE.Color(emissive);
        m.emissiveIntensity = ei;
      }
      disposables.push(m);
      return m;
    };
    const boxGeo = (w: number, h: number, d: number) => {
      const g = new THREE.BoxGeometry(w, h, d);
      disposables.push(g);
      return g;
    };

    const emblem = new THREE.Group();
    scene.add(emblem);

    // ---- ">" chevron, built from a pixel matrix of cubes ----
    const chevron = new THREE.Group();
    const pattern = ["11000", "01100", "00110", "00011", "00110", "01100", "11000"];
    const s = 0.26;
    const cubeGeo = boxGeo(s * 0.96, s * 0.96, s * 1.7); // tiny gap between cubes reads as pixels
    const chevMat = voxelMat(ACCENT_TO, ACCENT_FROM, dark ? 0.85 : 0.4);
    pattern.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "1") {
          const cube = new THREE.Mesh(cubeGeo, chevMat);
          cube.position.set(c * s, -r * s, 0);
          chevron.add(cube);
        }
      }
    });
    // center the matrix on its own origin
    const cbox = new THREE.Box3().setFromObject(chevron);
    const center = cbox.getCenter(new THREE.Vector3());
    chevron.children.forEach((ch) => ch.position.sub(center));
    chevron.position.set(0.95, 0.5, 0);
    chevron.rotation.y = -0.18;
    emblem.add(chevron);

    // ---- pixel pencil (square cross-section, stepped nib) ----
    const pen = new THREE.Group();
    pen.rotation.z = Math.PI / 3.6;
    pen.position.set(-0.6, -0.3, 0);
    const bw = 0.3;
    const addBox = (w: number, h: number, d: number, color: number, y: number, x = 0, em?: number, ei = 0) => {
      const mesh = new THREE.Mesh(boxGeo(w, h, d), voxelMat(color, em, ei));
      mesh.position.set(x, y, 0);
      pen.add(mesh);
    };
    addBox(bw, 1.7, bw, ACCENT_FROM, 0.2, 0, ACCENT_FROM, dark ? 0.25 : 0.1); // barrel
    addBox(bw * 1.06, 0.42, bw * 1.06, ACCENT_TO, -0.75, 0, ACCENT_FROM, dark ? 0.4 : 0.15); // band
    addBox(0.24, 0.16, 0.24, 0xe9c08a, -1.04); // wood nib step 1
    addBox(0.16, 0.14, 0.16, 0xe9c08a, -1.19); // wood nib step 2
    addBox(0.08, 0.12, 0.08, 0x26262e, -1.31); // graphite tip
    addBox(bw * 1.08, 0.14, bw * 1.08, 0xd8d8e0, 1.0); // metal ferrule
    addBox(bw * 1.04, 0.24, bw * 1.04, 0xf06ec0, 1.18); // eraser
    addBox(0.06, 0.5, 0.12, 0xd8d8e0, 0.78, 0.18); // clip
    emblem.add(pen);

    // ---- interaction (drag to spin, inertial coast) ----
    let active = false;
    let rx = 0;
    let ry = 0;
    let vx = 0;
    let vy = 0;
    let lastX = 0;
    let lastY = 0;
    const el = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      active = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const dx = (e.clientX - lastX) * 0.01;
      const dy = (e.clientY - lastY) * 0.01;
      lastX = e.clientX;
      lastY = e.clientY;
      ry += dx;
      rx += dy;
      vx = dx;
      vy = dy;
    };
    const onUp = () => {
      active = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // ---- animation loop ----
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const delta = clock.getDelta();
      if (!active) {
        ry += delta * 0.25 + vx;
        rx += vy;
        vx *= 0.92;
        vy *= 0.92;
      }
      rx = Math.max(-0.6, Math.min(0.6, rx));
      emblem.rotation.y = ry;
      emblem.rotation.x = rx;
      emblem.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.12;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // ---- resize ----
    const onResize = () => {
      camera.aspect = getW() / getH();
      camera.updateProjectionMatrix();
      renderer.setSize(getW(), getH());
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
    };
  }, [dark]);

  return <div ref={mountRef} style={{ width: "100%", height: "26rem" }} />;
}
