import * as THREE from "three";
import { CONFIG } from "./config";
import { ParticleType, GestureType, ParticleUserData } from "../types";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

export function createParticleSystem(
  type: ParticleType,
  count: number,
  size: number,
  textures: Record<ParticleType, THREE.CanvasTexture>,
  scene: THREE.Scene
): THREE.Points {
  const pPositions: number[] = [];
  const pExplodeTargets: number[] = [];
  const pTreeTargets: number[] = new Array(count * 3).fill(0);
  const pHeartTargets: number[] = [];
  const sizes: number[] = [];
  const phases: number[] = [];

  
  for (let i = 0; i < count; i++) {
    pPositions.push(0, 0, 0);
    sizes.push(size);
    phases.push(Math.random() * Math.PI * 2);

    // EXPLODE
    const u = Math.random();
    const v = Math.random();
    const phi = Math.acos(2 * v - 1);
    const lam = 2 * Math.PI * u;
    const rad = CONFIG.explodeRadius * Math.cbrt(Math.random());
    pExplodeTargets.push(
      rad * Math.sin(phi) * Math.cos(lam),
      rad * Math.sin(phi) * Math.sin(lam),
      rad * Math.cos(phi)
    );

    // HEART
    const t = Math.random() * Math.PI * 2;
    let hx = 16 * Math.pow(Math.sin(t), 3);
    let hy =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    const r = Math.pow(Math.random(), 0.3);
    hx *= r;
    hy *= r;
    const hz = (Math.random() - 0.5) * 8 * r;
    pHeartTargets.push(hx * 2.2, hy * 2.2 + 5, hz);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pPositions, 3));
  geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const baseColor = new THREE.Color(
    type === "gold" ? 0xffd700 : type === "red" ? 0xff0000 : 0xffffff
  );

  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = baseColor.r;
    colors[i * 3 + 1] = baseColor.g;
    colors[i * 3 + 2] = baseColor.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  geo.userData = {
    tree: pTreeTargets,
    explode: pExplodeTargets,
    heart: pHeartTargets,
    phases,
    baseColor,
    baseSize: size,
    modelLoaded: false,
  } as ParticleUserData & { modelLoaded: boolean };

  // 🐎 LOAD MODEL
  console.log("BASE URL:", import.meta.env.BASE_URL);

  const loader = new OBJLoader();
  loader.load(
  `${import.meta.env.BASE_URL}models/horse.obj`, (obj) => {
    let mesh: THREE.Mesh | undefined;

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        mesh = child;
      }
    });

    if (!mesh) return;

    mesh.rotation.x = -Math.PI / 2;   
    mesh.updateMatrixWorld(true);

    const geometry = mesh.geometry as THREE.BufferGeometry;
    geometry.center();

    const sampler = new MeshSurfaceSampler(mesh).build();
    const temp = new THREE.Vector3();


    const scale = 0.8;
    for (let i = 0; i < count; i++) {
      sampler.sample(temp);
      pTreeTargets[i * 3]     = temp.x * scale;
      pTreeTargets[i * 3 + 1] = temp.y * scale - 1; // hạ nhẹ xuống đất
      pTreeTargets[i * 3 + 2] = temp.z * scale;
    }

    geo.userData.modelLoaded = true;
  });


  const mat = new THREE.PointsMaterial({
    size,
    map: textures[type],
    transparent: true,
    vertexColors: true,
    blending: type === "gift" ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  return points;
}

export function updateParticleGroup(
  group: THREE.Points,
  _type: ParticleType,
  targetState: GestureType,
  speed: number,
  _handRotY: number,
  time: number
): void {
  const geo = group.geometry;
  const positions = geo.attributes.position.array as Float32Array;
  const sizes = geo.attributes.size.array as Float32Array;
  const colors = geo.attributes.color.array as Float32Array;
  const userData = group.geometry.userData as ParticleUserData & { modelLoaded?: boolean };

  if (targetState === "TREE" && !userData.modelLoaded) return;

  const targets =
    targetState === "TREE"
      ? userData.tree
      : targetState === "HEART"
      ? userData.heart
      : userData.explode;

  for (let i = 0; i < positions.length; i++) {
    positions[i] += (targets[i] - positions[i]) * speed;
  }
  geo.attributes.position.needsUpdate = true;

  const count = positions.length / 3;
  const baseColor = userData.baseColor;
  const baseSize = userData.baseSize;
  const phases = userData.phases;

  if (targetState === "TREE") {
    group.rotation.y += 0.003;
    for (let i = 0; i < count; i++) {
      sizes[i] = baseSize;
      const b = 0.8 + 0.4 * Math.sin(time * 6 + phases[i]);
      colors[i * 3] = baseColor.r * b;
      colors[i * 3 + 1] = baseColor.g * b;
      colors[i * 3 + 2] = baseColor.b * b;
    }
  } else if (targetState === "HEART") {
    group.rotation.y = 0;
    const beat = 1 + Math.abs(Math.sin(time * 3)) * 0.15;
    group.scale.set(beat, beat, beat);
    for (let i = 0; i < count; i++) sizes[i] = i % 3 === 0 ? baseSize : 0;
  } else {
    group.scale.set(1, 1, 1);
    for (let i = 0; i < count; i++) {
      sizes[i] = baseSize;
      const b = 0.8 + 0.5 * Math.sin(time * 10 + phases[i]);
      colors[i * 3] = baseColor.r * b;
      colors[i * 3 + 1] = baseColor.g * b;
      colors[i * 3 + 2] = baseColor.b * b;
    }
  }

  geo.attributes.size.needsUpdate = true;
  geo.attributes.color.needsUpdate = true;
}
