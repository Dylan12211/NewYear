import * as THREE from "three";
import { CONFIG, photoFiles, photoMessages, state } from "./config";
import { initTextures } from "./textures";
import { createParticleSystem, updateParticleGroup } from "./particles";
import { SceneObjects } from "../types";

// Helper function to update message text
let currentMessage = "";
function updateMessageText(messageMesh: THREE.Mesh, text: string): void {
  // Chỉ update khi message thay đổi
  if (currentMessage === text) return;
  currentMessage = text;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.font = 'bold 48px "Arial", sans-serif';
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 10;
  ctx.fillText(text, 512, 70);

  const texture = new THREE.CanvasTexture(canvas);
  (messageMesh.material as THREE.MeshBasicMaterial).map = texture;
  (messageMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
}

let sceneObjects: Partial<SceneObjects> = {};

export function getSceneObjects(): Partial<SceneObjects> {
  return sceneObjects;
}

export function init3D(container: HTMLElement): void {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Load textures and create particles
  const textures = initTextures();
  const groupGold = createParticleSystem(
    "gold",
    CONFIG.goldCount,
    2.0,
    textures,
    scene
  );
  const groupRed = createParticleSystem(
    "red",
    CONFIG.redCount,
    3.5,
    textures,
    scene
  );
  const groupGift = createParticleSystem(
    "gift",
    CONFIG.giftCount,
    3.0,
    textures,
    scene
  );

  // Create photo meshes
  const photoMeshes = createPhotos(scene);

  // Load photo textures
  const photoTextures: THREE.Texture[] = [];
  const loader = new THREE.TextureLoader();
  console.log(
    `🎬 Loading ${photoFiles.length} textures for ${photoMeshes.length} meshes...`
  );

  photoFiles.forEach((f, i) => {
    loader.load(
      f,
      (texture: THREE.Texture) => {
        photoTextures[i] = texture;
        console.log(`✅ Texture ${i} loaded successfully:`, f);
        if (photoMeshes[i]) {
          const mat = photoMeshes[i].material as THREE.MeshBasicMaterial;
          mat.map = texture;
          mat.needsUpdate = true;
          console.log(`🖼️ Assigned texture ${i} to mesh`);
        }
      },
      undefined,
      (error: unknown) => {
        console.error(`❌ Error loading texture ${i}:`, f, error);
      }
    );
  });

  const { titleMesh, starMesh, loveMesh, messageMesh } =
    createDecorations(scene);

  sceneObjects = {
    scene,
    camera,
    renderer,
    groupGold,
    groupRed,
    groupGift,
    photoMeshes,
    titleMesh,
    starMesh,
    loveMesh,
    messageMesh,
    photoTextures,
  };
}

function createPhotos(scene: THREE.Scene): THREE.Mesh[] {
  const photoMeshes: THREE.Mesh[] = [];
  const geo = new THREE.PlaneGeometry(8, 8);
  const borderGeo = new THREE.PlaneGeometry(9.5, 9.5);
  const borderMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
  });

  console.log(`📦 Creating ${CONFIG.PHOTO_COUNT} photo meshes...`);

  for (let i = 0; i < CONFIG.PHOTO_COUNT; i++) {
    const mat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.1;
    mesh.add(border);
    mesh.visible = false;
    mesh.scale.set(0, 0, 0);
    scene.add(mesh);
    photoMeshes.push(mesh);
  }

  console.log(`✅ Created ${photoMeshes.length} photo meshes`);
  return photoMeshes;
}

function createDecorations(scene: THREE.Scene): {
  titleMesh: THREE.Mesh;
  starMesh: THREE.Mesh;
  loveMesh: THREE.Mesh;
  messageMesh: THREE.Mesh;
} {
  // MERRY CHRISTMAS text
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.font = 'bold italic 90px "Times New Roman"';
  ctx.fillStyle = "#FFD700";
  ctx.textAlign = "center";
  ctx.shadowColor = "#FF0000";
  ctx.shadowBlur = 40;
  ctx.fillText("HAPPY NEW YEAR", 512, 130);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 15), mat);
  titleMesh.position.set(0, 50, 0);
  scene.add(titleMesh);

  // STAR
  const starCanvas = document.createElement("canvas");
  starCanvas.width = 128;
  starCanvas.height = 128;
  const sCtx = starCanvas.getContext("2d")!;
  sCtx.fillStyle = "#FFFF00";
  sCtx.shadowColor = "#FFF";
  sCtx.shadowBlur = 20;
  sCtx.beginPath();
  const cx = 64,
    cy = 64,
    outer = 50,
    inner = 20;
  for (let i = 0; i < 5; i++) {
    sCtx.lineTo(
      cx + Math.cos(((18 + i * 72) / 180) * Math.PI) * outer,
      cy - Math.sin(((18 + i * 72) / 180) * Math.PI) * outer
    );
    sCtx.lineTo(
      cx + Math.cos(((54 + i * 72) / 180) * Math.PI) * inner,
      cy - Math.sin(((54 + i * 72) / 180) * Math.PI) * inner
    );
  }
  sCtx.closePath();
  sCtx.fill();
  const starTex = new THREE.CanvasTexture(starCanvas);
  const starMat = new THREE.MeshBasicMaterial({
    map: starTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const starMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), starMat);
  starMesh.position.set(0, CONFIG.treeHeight / 2 + 2, 0);
  scene.add(starMesh);

  // I LOVE YOU TEXT
  const loveCanvas = document.createElement("canvas");
  loveCanvas.width = 1024;
  loveCanvas.height = 256;
  const lCtx = loveCanvas.getContext("2d")!;
  lCtx.font = 'bold 120px "Segoe UI", sans-serif';
  lCtx.fillStyle = "#FF69B4";
  lCtx.textAlign = "center";
  lCtx.shadowColor = "#FF1493";
  lCtx.shadowBlur = 40;
  lCtx.fillText("I LOVE YOU ❤️", 512, 130);
  const loveTex = new THREE.CanvasTexture(loveCanvas);
  const loveMat = new THREE.MeshBasicMaterial({
    map: loveTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const loveMesh = new THREE.Mesh(new THREE.PlaneGeometry(70, 18), loveMat);
  loveMesh.position.set(0, 0, 20);
  loveMesh.visible = false;
  scene.add(loveMesh);

  // MESSAGE TEXT (for photo descriptions)
  const messageCanvas = document.createElement("canvas");
  messageCanvas.width = 1024;
  messageCanvas.height = 128;
  const mCtx = messageCanvas.getContext("2d")!;
  mCtx.font = 'bold 48px "Arial", sans-serif';
  mCtx.fillStyle = "#FFFFFF";
  mCtx.textAlign = "center";
  mCtx.shadowColor = "#000000";
  mCtx.shadowBlur = 10;
  mCtx.fillText("", 512, 70); // Empty initially
  const messageTex = new THREE.CanvasTexture(messageCanvas);
  const messageMat = new THREE.MeshBasicMaterial({
    map: messageTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const messageMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 6),
    messageMat
  );
  messageMesh.position.set(0, 0, 60);
  messageMesh.visible = false;
  scene.add(messageMesh);

  return { titleMesh, starMesh, loveMesh, messageMesh };
}

export function animate(): void {
  requestAnimationFrame(animate);
  const {
    scene,
    camera,
    renderer,
    groupGold,
    groupRed,
    groupGift,
    photoMeshes,
    titleMesh,
    starMesh,
    loveMesh,
    messageMesh,
  } = sceneObjects as SceneObjects;

  if (!scene || !camera || !renderer) return;

  const time = Date.now() * 0.001;
  const speed = 0.08;
  const handRotY = (state.handX - 0.5) * 4.0;

  if (groupGold)
    updateParticleGroup(
      groupGold,
      "gold",
      state.current,
      speed,
      handRotY,
      time
    );
  if (groupRed)
    updateParticleGroup(groupRed, "red", state.current, speed, handRotY, time);
  if (groupGift)
    updateParticleGroup(
      groupGift,
      "gift",
      state.current,
      speed,
      handRotY,
      time
    );

  if (state.current === "TREE") {
    if (titleMesh) {
      titleMesh.visible = false; // Ẩn text MERRY CHRISTMAS
    }
    if (starMesh) {
      starMesh.visible = true;
      starMesh.rotation.z -= 0.02;
      (starMesh.material as THREE.MeshBasicMaterial).opacity =
        0.7 + 0.3 * Math.sin(time * 5);
    }
    if (loveMesh) loveMesh.visible = false;
    if (messageMesh) messageMesh.visible = false;
    photoMeshes?.forEach((m) => {
      m.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      m.visible = false;
    });
    state.explodeRotation = 0;
  } else if (state.current === "HEART") {
    if (titleMesh) titleMesh.visible = false;
    if (starMesh) starMesh.visible = false;
    if (loveMesh) {
      loveMesh.visible = true;
      const s = 1 + Math.abs(Math.sin(time * 3)) * 0.1;
      loveMesh.scale.set(s, s, 1);
    }
    if (messageMesh) messageMesh.visible = false;
    photoMeshes?.forEach((m) => {
      m.visible = false;
    });
    state.explodeRotation = 0;

  } else if (state.current === "EXPLODE") {
    // ===== HANDLE SWIPE CHANGE PHOTO =====
    if (state.swipeDirection !== 0) {
      state.nextPhotoIndex =
        (state.nextPhotoIndex + state.swipeDirection + CONFIG.PHOTO_COUNT) %
        CONFIG.PHOTO_COUNT;

      state.swipeDirection = 0;
    }

    // 🎯 Xoay mượt về ảnh mục tiêu
    const targetRotation =
      -state.nextPhotoIndex * ((Math.PI * 2) / CONFIG.PHOTO_COUNT);

    state.explodeRotation += (targetRotation - state.explodeRotation) * 0.08;
    if (titleMesh) titleMesh.visible = false;
    if (starMesh) starMesh.visible = false;
    if (loveMesh) loveMesh.visible = false;
    if (messageMesh) messageMesh.visible = false;

    const handControl = (state.handX - 0.5) * 0.15;
    state.explodeRotation += handControl;

    const baseAngle = state.explodeRotation;
    const angleStep = (Math.PI * 2) / CONFIG.PHOTO_COUNT;
    let bestIdx = 0;
    let maxZ = -999;

    photoMeshes?.forEach((mesh, i) => {
      mesh.visible = true;
      const angle = baseAngle + i * angleStep;
      const x = Math.sin(angle) * CONFIG.photoOrbitRadius;
      const z = Math.cos(angle) * CONFIG.photoOrbitRadius;
      const y = Math.sin(time + i) * 3;
      mesh.position.lerp(new THREE.Vector3(x, y, z), 0.1);
      mesh.lookAt(camera.position);
      if (z > maxZ) {
        maxZ = z;
        bestIdx = i;
      }
      if (z > 5) {
        const ds = 1.0 + (z / CONFIG.photoOrbitRadius) * 0.8;
        mesh.scale.lerp(new THREE.Vector3(ds, ds, ds), 0.1);
      } else {
        mesh.scale.lerp(new THREE.Vector3(0.6, 0.6, 0.6), 0.1);
      }
    });
    state.selectedIndex = bestIdx;
  } else if (state.current === "PHOTO") {
    if (titleMesh) titleMesh.visible = false;
    if (starMesh) starMesh.visible = false;
    if (loveMesh) loveMesh.visible = false;

    photoMeshes?.forEach((mesh, i) => {
      if (i === state.selectedIndex) {
        mesh.visible = true;
        mesh.position.lerp(new THREE.Vector3(0, 0, 60), 0.1);
        mesh.scale.lerp(new THREE.Vector3(5, 5, 5), 0.1);
        mesh.lookAt(camera.position);
        mesh.rotation.z = 0;
      } else {
        mesh.visible = false;
        mesh.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      }
    });

    // Hiển thị message của ảnh đang xem
    if (messageMesh) {
      messageMesh.visible = true;
      const message = photoMessages[state.selectedIndex] || "";
      updateMessageText(messageMesh, message);
      messageMesh.position.lerp(new THREE.Vector3(0, -18, 60), 0.1);
      messageMesh.lookAt(camera.position);
    }

    state.explodeRotation = 0;
  }

  renderer.render(scene, camera);
}

export function handleResize(): void {
  const { camera, renderer } = sceneObjects as SceneObjects;
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
