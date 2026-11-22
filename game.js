import * as THREE from 'three';

/* ================= seeded rng ================= */
let _s = 1983;
const rnd = () => { _s = (_s * 16807) % 2147483647; return _s / 2147483647; };
const rr = (a, b) => a + rnd() * (b - a);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

/* ================= procedural canvas textures ================= */
function makeCanvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function noiseOver(ctx, w, h, alpha, n) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(0,0,0,${alpha * rnd()})`;
    ctx.fillRect(rnd() * w, rnd() * h, rr(1, 3), rr(1, 3));
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5 * rnd()})`;
    ctx.fillRect(rnd() * w, rnd() * h, rr(1, 3), rr(1, 3));
  }
}
const T = {};
function buildTextures() {
  T.grass = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#17230f'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = pick(['#1c2c12', '#131e0c', '#223318', '#0f1a0a', '#243520']);
      ctx.fillRect(rnd() * w, rnd() * h, rr(1, 4), rr(1, 4));
    }
  });
  T.road = makeCanvas(256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#1c1d20'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6000; i++) {
      ctx.fillStyle = pick(['#222327', '#17181b', '#26262a', '#141417', '#28221c']);
      ctx.fillRect(rnd() * w, rnd() * h, rr(1, 3), rr(1, 3));
    }
    ctx.fillStyle = 'rgba(190,180,120,.5)'; ctx.fillRect(w / 2 - 2, 0, 4, h);
    for (let i = 0; i < 60; i++) { ctx.fillStyle = 'rgba(90,60,25,.6)'; ctx.fillRect(rnd() * w, rnd() * h, rr(2, 6), rr(2, 6)); }
    noiseOver(ctx, w, h, .12, 1500);
  });
  T.asphalt = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1e1f23'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = pick(['#242529', '#191a1d', '#28292d', '#151619']);
      ctx.fillRect(rnd() * w, rnd() * h, rr(1, 3), rr(1, 3));
    }
  });
  T.bark = makeCanvas(128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#3a2c1e'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = pick(['#2c2116', '#463525', '#33271a', '#241b12']);
      ctx.fillRect(rnd() * w, rnd() * h, rr(2, 5), rr(10, 60));
    }
  });
  T.brick = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#5e2a22'; ctx.fillRect(0, 0, w, h);
    const bw = 32, bh = 14;
    for (let y = 0; y < h; y += bh) {
      const off = (y / bh) % 2 ? bw / 2 : 0;
      for (let x = -bw; x < w + bw; x += bw) {
        ctx.fillStyle = pick(['#6b3128', '#59251e', '#74382c', '#4f211b', '#653027']);
        ctx.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
      }
    }
    noiseOver(ctx, w, h, .1, 1200);
  });
  T.siding = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#8b8f94'; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 16) {
      ctx.fillStyle = `rgba(0,0,0,${.18 + rnd() * .15})`; ctx.fillRect(0, y, w, 2);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(0, y + 3, w, 2);
      for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(60,64,70,${rnd() * .12})`; ctx.fillRect(rnd() * w, y + rnd() * 16, rr(2, 8), 1); }
    }
  });
  T.poolCover = makeCanvas(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#1d3326'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(10,20,14,${rnd() * .8})`; ctx.fillRect(rnd() * w, rnd() * h, rr(4, 18), rr(2, 8)); }
  });
  T.concrete = makeCanvas(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#4c4e51'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1200; i++) { ctx.fillStyle = `rgba(255,255,255,${rnd() * .06})`; ctx.fillRect(rnd() * w, rnd() * h, 2, 2); }
  });
  T.cloud = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const x = rr(40, w - 40), y = rr(70, h - 60), r = rr(22, 58);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(120,130,160,.28)'); g.addColorStop(1, 'rgba(120,130,160,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
  });
  T.windowLit = makeCanvas(64, 96, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#ffd9a0'); g.addColorStop(1, '#c98a3f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 20; i++) { ctx.fillStyle = 'rgba(120,70,20,.15)'; ctx.fillRect(rnd() * w, rnd() * h, rr(4, 12), rr(2, 6)); }
    ctx.fillStyle = 'rgba(40,25,10,.9)'; ctx.fillRect(w / 2 - 2, 0, 4, h); ctx.fillRect(0, h / 2 - 2, w, 4);
  });
  T.windowCool = makeCanvas(64, 96, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#bcd8ff'); g.addColorStop(1, '#5f7fae');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(20,30,45,.9)'; ctx.fillRect(w / 2 - 2, 0, 4, h); ctx.fillRect(0, h / 2 - 2, w, 4);
  });
  T.windowDark = makeCanvas(64, 96, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#0b1016'); g.addColorStop(1, '#131b24');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(70,90,110,.25)'; ctx.fillRect(w * .6, h * .2, 10, 6);
    ctx.fillStyle = 'rgba(40,55,70,.5)'; ctx.fillRect(w / 2 - 2, 0, 4, h); ctx.fillRect(0, h / 2 - 2, w, 4);
  });
  T.cityTex = makeCanvas(128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#04060c'; ctx.fillRect(0, 0, w, h);
    for (let y = 8; y < h - 6; y += 10) for (let x = 6; x < w - 6; x += 8) {
      if (rnd() < .28) { ctx.fillStyle = pick(['#ffd27a', '#ffc466', '#ffe9b0', '#9fc6ff']); ctx.fillRect(x, y, 4, 5); }
    }
  });
  T.poster = makeCanvas(128, 160, (ctx, w, h) => {
    ctx.fillStyle = '#d8cfb8'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1a1a1a'; ctx.font = 'bold 15px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('MISSING', w / 2, 24);
    ctx.fillStyle = '#555'; ctx.fillRect(28, 34, 72, 66);
    ctx.fillStyle = '#9a8f78'; ctx.beginPath(); ctx.arc(64, 62, 18, 0, 7); ctx.fill();
    ctx.fillStyle = '#1a1a1a'; ctx.font = 'bold 10px Courier New';
    ctx.fillText('WILL BYERS', w / 2, 118); ctx.fillText('AGE 12', w / 2, 132);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(120,110,90,.5)'; ctx.fillRect(0, rr(0, h), w, 2); }
  });
  T.sign = makeCanvas(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#8a1f1f'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#d9b25c'; ctx.lineWidth = 6; ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 44px Georgia';
    ctx.fillText('HAWKINS MIDDLE SCHOOL', w / 2, 78);
    ctx.fillStyle = '#d9b25c'; ctx.font = 'bold 20px Georgia';
    ctx.fillText('HOME OF THE CUBS', w / 2, 106);
    ctx.beginPath(); ctx.arc(38, 64, 12, 0, 7); ctx.fill();
  });
  return T;
}

/* ================= renderer / scene ================= */
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a101c, 0.011);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 2600);
scene.add(camera);

const tex = buildTextures();

/* ================= lights ================= */
scene.add(new THREE.HemisphereLight(0x28344e, 0x0b0e08, 0.55));

const moon = new THREE.DirectionalLight(0x9db4dd, 0.85);
moon.position.set(60, 120, 40);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.near = 1; moon.shadow.camera.far = 320;
moon.shadow.camera.left = -70; moon.shadow.camera.right = 70;
moon.shadow.camera.top = 70; moon.shadow.camera.bottom = -70;
moon.shadow.bias = -0.0004;
scene.add(moon); scene.add(moon.target);

const flashlight = new THREE.SpotLight(0xfff2d4, 0, 42, THREE.MathUtils.degToRad(19), 0.45, 1.4);
flashlight.position.set(0.12, -0.08, 0);
camera.add(flashlight);
const flTarget = new THREE.Object3D(); flTarget.position.set(0, 0, -10);
camera.add(flTarget); flashlight.target = flTarget;

/* ================= sky ================= */
const skyGeo = new THREE.SphereGeometry(1100, 32, 20);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, fog: false, depthWrite: false,
  uniforms: {
    top: { value: new THREE.Color(0x030509) },
    mid: { value: new THREE.Color(0x0b1526) },
    cityDir: { value: new THREE.Vector3(0.15, 0, 1).normalize() },
  },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 cityDir;
    void main(){
      float up = clamp(vP.y, 0.0, 1.0);
      vec3 col = mix(mid, top, pow(up, 0.6));
      float glow = pow(max(dot(normalize(vP), cityDir), 0.0), 8.0) * (1.0 - up);
      col += vec3(0.55, 0.30, 0.12) * glow * 0.55;
      gl_FragColor = vec4(col, 1.0);
    }`
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

/* stars */
{
  const n = 1400, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3().setFromSphericalCoords(1000, Math.acos(rr(0.12, 1)), rr(0, Math.PI * 2));
    pos.set([v.x, v.y, v.z], i * 3);
    const b = rr(0.35, 1); col.set([b, b, b * rr(0.92, 1.05)], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 2.4, vertexColors: true, fog: false, sizeAttenuation: false, transparent: true, opacity: 0.9 })));
}

/* moon disc */
{
  const m = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeCanvas(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, 'rgba(235,240,250,1)'); g.addColorStop(0.14, 'rgba(220,228,245,.98)');
      g.addColorStop(0.28, 'rgba(180,195,225,.35)'); g.addColorStop(1, 'rgba(160,175,210,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(150,160,180,.25)';
      [[52, 50, 9], [74, 72, 12], [60, 78, 7]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); });
    }),
    fog: false, depthWrite: false, transparent: true
  }));
  m.scale.setScalar(150); m.position.set(240, 420, 560);
  scene.add(m);
}

/* clouds */
const clouds = [];
{
  const cloudMat = new THREE.MeshBasicMaterial({ map: T.cloud, transparent: true, fog: false, depthWrite: false, side: THREE.DoubleSide, opacity: 0.85 });
  for (let i = 0; i < 26; i++) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(rr(140, 320), rr(60, 130)), cloudMat);
    c.rotation.x = -Math.PI / 2.15;
    c.position.set(rr(-700, 700), rr(130, 260), rr(-700, 700));
    c.rotation.z = rr(0, Math.PI * 2);
    scene.add(c); clouds.push(c);
  }
}

/* ================= world helpers ================= */
const colliders = [];
const addBox = (cx, cz, hx, hz, cy = 0, hh = 5) => colliders.push({ x0: cx - hx, x1: cx + hx, z0: cz - hz, z1: cz + hz, cy, hh });

function mat(map, opts = {}) { return new THREE.MeshStandardMaterial({ map, roughness: 0.93, metalness: 0.03, ...opts }); }

function gableRoof(w, d, h, color = 0x2a2523) {
  const g = new THREE.BufferGeometry();
  const hw = w / 2, hd = d / 2;
  const v = [
    -hw, 0, hd, hw, 0, hd, hw, h, 0, -hw, h, 0,
    hw, 0, -hd, -hw, 0, -hd, -hw, h, 0, hw, h, 0,
    -hw, h, 0, -hw, 0, -hd, -hw, 0, hd,
    hw, h, 0, hw, 0, hd, hw, 0, -hd,
  ];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: THREE.DoubleSide }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function makeTreePine(s) {
  const g = new THREE.Group();
  const th = 2.4 * s;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * s, 0.34 * s, th, 6), mat(T.bark));
  trunk.position.y = th / 2; trunk.castShadow = true; g.add(trunk);
  for (let i = 0; i < 3; i++) {
    const cr = (1.7 - i * 0.42) * s, ch = (2.6 - i * 0.25) * s;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(cr, ch, 7),
      new THREE.MeshStandardMaterial({ color: pick([0x14250f, 0x182c12, 0x101f0c]), roughness: 1 }));
    cone.position.y = th + i * 1.05 * s + ch / 2; cone.castShadow = true; g.add(cone);
  }
  return g;
}
function makeTreeLeaf(s) {
  const g = new THREE.Group();
  const th = 2.8 * s;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.42 * s, th, 6), mat(T.bark));
  trunk.position.y = th / 2; trunk.castShadow = true; g.add(trunk);
  const cols = [0x3d4718, 0x4a4c1e, 0x5c4a20, 0x37401a];
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(rr(1.1, 1.7) * s, 7, 6),
      new THREE.MeshStandardMaterial({ color: pick(cols), roughness: 1 }));
    b.position.set(rr(-0.7, 0.7) * s, th + rr(-0.3, 0.9) * s, rr(-0.7, 0.7) * s);
    b.castShadow = true; g.add(b);
  }
  return g;
}
function windowPlane(w, h, texture) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.85, roughness: 0.4 }));
}
function lampPost(x, z) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 4.6, 6), new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.8 }));
  pole.position.y = 2.3; pole.castShadow = true; g.add(pole);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffe6b0, emissive: 0xffd27a, emissiveIntensity: 2.4 }));
  head.position.y = 4.7; g.add(head);
  const l = new THREE.PointLight(0xffca7a, 26, 17, 1.8); l.position.set(0, 4.6, 0); g.add(l);
  g.position.set(x, 0, z); scene.add(g); addBox(x, z, 0.15, 0.15, 2, 2.5);
  return g;
}
function pathPlane(x0, z0, x1, z1, w, parentScene) {
  const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, len, 1, 1),
    mat(T.concrete, { color: 0x4a4238, transparent: true, opacity: 0.75 }));
  p.rotation.x = -Math.PI / 2;
  p.position.set((x0 + x1) / 2, 0.015, (z0 + z1) / 2);
  p.rotation.z = -Math.atan2(dx, dz);
  p.receiveShadow = true;
  (parentScene || scene).add(p);
  return p;
}

/* ================= ground ================= */
{
  const g = new THREE.Mesh(new THREE.PlaneGeometry(1800, 1800), mat(T.grass));
  g.material.map = T.grass.clone(); g.material.map.needsUpdate = true;
  g.material.map.repeat.set(120, 120);
  g.rotation.x = -Math.PI / 2;
  g.receiveShadow = true;
  scene.add(g);
}

/* ================= MIRKWOOD (north, z ≈ -260) ================= */
const mwT = new THREE.Group(); mwT.position.set(0, 0, -260); scene.add(mwT);
{
  const pts = [];
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    pts.push(new THREE.Vector3(Math.sin(t * Math.PI * 0.9) * 14 - t * 6, 0, 260 - t * 520));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const seg = 120, hw = 3.6;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = curve.getPoint(t), tan = curve.getTangent(t);
    const n = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    pos.push(p.x - n.x * hw, 0.02, p.z - n.z * hw, p.x + n.x * hw, 0.02, p.z + n.z * hw);
    uv.push(0, t * 40, 1, t * 40);
  }
  for (let i = 0; i < seg; i++) {
    const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  const road = new THREE.Mesh(g, mat(T.road));
  road.material.map = T.road.clone(); road.material.map.needsUpdate = true;
  road.receiveShadow = true;
  mwT.add(road);

  const mistMat = new THREE.MeshBasicMaterial({ color: 0x4a5a75, transparent: true, opacity: 0.07, depthWrite: false });
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(rr(6, 14), rr(3, 6)), mistMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(rr(-26, 26), 0.06, rr(-300, 100));
    m.rotation.z = rr(0, 3);
    mwT.add(m);
  }

  const inRoadClearing = (x, z) => {
    for (let i = 0; i <= 22; i += 0.5) {
      const t = i / 22;
      const cx = Math.sin(t * Math.PI * 0.9) * 14 - t * 6;
      const cz = 260 - t * 520;
      if (Math.hypot(x - cx, z - cz) < 8) return true;
    }
    return false;
  };

  /* Hopper's cruiser */
  const barLights = [];
  let beacon;
  {
    const car = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.85, 4.6),
      new THREE.MeshStandardMaterial({ color: 0x14213d, roughness: 0.4, metalness: 0.5 }));
    body.position.y = 0.75; body.castShadow = true; car.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x0d1526, roughness: 0.25, metalness: 0.6 }));
    cabin.position.set(0, 1.45, 0.15); car.add(cabin);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.2, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.5 }));
    stripe.position.y = 0.7; car.add(stripe);
    const bar = new THREE.Group(); bar.position.set(0, 1.85, 0.15);
    const rl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x440404, emissive: 0xff2020, emissiveIntensity: 0, side: THREE.DoubleSide }));
    rl.position.x = -0.32; bar.add(rl);
    const bl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x041a44, emissive: 0x2050ff, emissiveIntensity: 0, side: THREE.DoubleSide }));
    bl.position.x = 0.32; bar.add(bl);
    barLights.push(rl.material, bl.material);
    car.add(bar);
    for (const [wx, wz] of [[-0.95, 1.5], [0.95, 1.5], [-0.95, -1.5], [0.95, -1.5]]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 10),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 }));
      wheel.rotation.z = Math.PI / 2; wheel.position.set(wx, 0.34, wz); car.add(wheel);
    }
    car.position.set(6.2, 0, 18); car.rotation.y = 0.5;
    mwT.add(car); addBox(6.2, -260 + 18, 1.4, 3.2, 0.8, 1);
    beacon = new THREE.PointLight(0xff3030, 0, 25, 1.5); beacon.position.set(6.2, 2.6, 17.8); scene.add(beacon);
  }

  /* MISSING posters nailed to trunks near the road */
  for (const [px, pz, ry] of [[-4.6, 10, 0.9], [-5.6, -42, 0.8], [4.9, 12, -0.9], [-5.1, 42, 0.6]]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.55),
      new THREE.MeshStandardMaterial({ map: T.poster, roughness: 1 }));
    p.position.set(px, 1.7, pz); p.rotation.y = ry;
    mwT.add(p);
  }

  /* forest */
  for (let i = 0; i < 340; i++) {
    const x = rr(-90, 90), z = rr(-140, 340);
    if (inRoadClearing(x, z)) continue;
    const tree = rnd() < 0.72 ? makeTreePine(rr(0.8, 1.7)) : makeTreeLeaf(rr(0.8, 1.5));
    tree.position.set(x, 0, z);
    tree.rotation.y = rr(0, 6.28);
    mwT.add(tree);
    colliders.push({ x0: x - 0.35, x1: x + 0.35, z0: z - 0.35, z1: z + 0.35, cy: 5, hh: 6 });
  }
  /* fireflies */
  let fireflies;
  {
    const n = 260, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pos.set([rr(-80, 80), rr(0.4, 5), rr(-130, 330)], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    fireflies = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbfff7a, size: 0.13, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    mwT.add(fireflies);
  }
  /* rocks */
  for (let i = 0; i < 26; i++) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rr(0.3, 0.9), 0),
      new THREE.MeshStandardMaterial({ color: 0x4a4c50, roughness: 1 }));
    const x = rr(-70, 70), z = rr(-120, 320);
    if (inRoadClearing(x, z)) continue;
    r.position.set(x, 0.15, z); r.rotation.set(rr(0, 3), rr(0, 3), rr(0, 3));
    r.castShadow = true; r.receiveShadow = true; mwT.add(r);
  }
  /* something wrong deep in the woods */
  {
    const l = new THREE.PointLight(0x8a1010, 4, 60, 1.6); l.position.set(-55, 4, 40); mwT.add(l);
  }

  window.__fireflies = fireflies;
  window.__barLights = barLights;
  window.__beacon = beacon;
}

/* ================= HARRINGTON HOUSE (east, x ≈ 260, z ≈ 260) ================= */
const hhT = new THREE.Group(); hhT.position.set(260, 0, 260); scene.add(hhT);
{
  const place = (m, x, y, z, collide, cy, hh) => {
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    hhT.add(m);
    if (collide) addBox(260 + x, 260 + z, collide[0], collide[1], cy, hh);
    return m;
  };

  /* driveway from the street */
  pathPlane(-44, 260 + 3.5, -8, 260 + 3.5, 7, hhT);
  pathPlane(-8, 260 + 3.5, 6, 260 + 3.5, 7.2, hhT);
  const drive = new THREE.Mesh(new THREE.PlaneGeometry(8, 18), mat(T.concrete, { color: 0x4f5058 }));
  drive.rotation.x = -Math.PI / 2; drive.position.set(6, 0.015, 260 - 6); drive.receiveShadow = true; hhT.add(drive);

  /* lawn */
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(56, 44), mat(T.grass));
  lawn.material.map = T.grass.clone(); lawn.material.map.needsUpdate = true; lawn.material.map.repeat.set(8, 6);
  lawn.rotation.x = -Math.PI / 2; lawn.position.set(2, 0.01, -8); lawn.receiveShadow = true; hhT.add(lawn);

  /* house: lower brick story, upper siding story, gable roof (rear faces -z toward the yard) */
  const lower = new THREE.Mesh(new THREE.BoxGeometry(16, 3.4, 11), mat(T.brick, { color: 0x9a5a4a }));
  place(lower, 0, 1.7, -6, [8.3, 5.8], 1.7, 2);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(15, 3.1, 10), mat(T.siding, { color: 0xb9bcc0 }));
  place(upper, 0.4, 4.95, -6.3, [7.9, 5.4], 4.9, 1.7);
  const roof = gableRoof(15.6, 10.6, 3.2, 0x2d2622);
  roof.position.set(0.4, 6.5, -6.3); hhT.add(roof);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(7, 3.2, 6), mat(T.brick, { color: 0x8f5344 }));
  place(wing, 9.4, 1.6, -13.5, [3.6, 3.1], 1.6, 1.7);
  const wingRoof = gableRoof(7.4, 6.4, 1.8, 0x2d2622);
  wingRoof.position.set(9.4, 3.2, -13.5); hhT.add(wingRoof);

  /* rear windows */
  const rearZ = -11.52;
  const mkWin = (x, y, w, h, t2, light) => {
    const win = windowPlane(w, h, t2);
    win.position.set(x, y, rearZ); win.rotation.y = Math.PI; hhT.add(win);
    if (light) {
      const pl = new THREE.PointLight(light.c, light.i, 14, 1.7);
      pl.position.set(260 + x, y, 260 + rearZ - 1.1); scene.add(pl);
    }
  };
  mkWin(-3.4, 1.9, 1.5, 1.9, T.windowLit, { c: 0xffb36b, i: 7 });
  mkWin(-1.1, 1.9, 1.5, 1.9, T.windowDark);
  mkWin(1.4, 1.9, 1.5, 1.9, T.windowLit);
  mkWin(2.8, 5.1, 1.3, 1.5, T.windowCool, { c: 0x9db8e8, i: 4 }); /* Steve's room */
  mkWin(0.1, 5.1, 1.3, 1.5, T.windowDark);
  mkWin(-2.2, 5.1, 1.3, 1.5, T.windowDark);

  /* exterior wall lamp near the patio */
  {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a }));
    box.position.set(8.05, 2.6, -8); hhT.add(box);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffe2a8, emissive: 0xffd27a, emissiveIntensity: 3 }));
    bulb.position.set(8.05, 2.52, -8); hhT.add(bulb);
    const pl = new THREE.PointLight(0xffca7a, 14, 12, 1.7); pl.position.set(260 + 8.05, 2.5, 260 - 8.6); scene.add(pl);
  }

  /* patio + furniture + umbrella */
  const patio = new THREE.Mesh(new THREE.PlaneGeometry(13, 7), mat(T.concrete, { color: 0x5a5c60 }));
  patio.rotation.x = -Math.PI / 2; patio.position.set(-3.2, 0.02, -16.5); patio.receiveShadow = true; hhT.add(patio);
  {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.08, 18),
      new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.8 }));
    table.position.set(-3.2, 0.78, -16.5); table.castShadow = true; hhT.add(table);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.78, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a4a48 }));
    leg.position.set(-3.2, 0.39, -16.5); hhT.add(leg);
    for (const [cx, cz, ry] of [[-4.6, -16.5, 0.6], [-1.8, -16.5, -0.6], [-3.2, -18, 0], [-3.2, -15, Math.PI]]) {
      const chair = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.07, 0.55),
        new THREE.MeshStandardMaterial({ color: 0xcfc8b6, roughness: 0.85 }));
      seat.position.y = 0.48; seat.castShadow = true; chair.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.07),
        new THREE.MeshStandardMaterial({ color: 0xcfc8b6, roughness: 0.85 }));
      back.position.set(0, 0.8, 0.26); back.castShadow = true; chair.add(back);
      for (const [lx, lz] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) {
        const l2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.48, 6),
          new THREE.MeshStandardMaterial({ color: 0x5a5852 }));
        l2.position.set(lx, 0.24, lz); chair.add(l2);
      }
      chair.position.set(cx, 0, cz); chair.rotation.y = ry; hhT.add(chair);
    }
    addBox(260 - 3.2, 260 - 16.5, 1.7, 1.7, 0.6, 0.6);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x77675a }));
    pole.position.set(-3.2, 1.9, -16.5); hhT.add(pole);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: 0x7a3b2e, roughness: 0.9 }));
    shade.position.set(-3.2, 3.05, -16.5); shade.castShadow = true; hhT.add(shade);
  }

  /* pool with wintered green cover (right of the house, as in the photo) */
  {
    const rim = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.34, 5.4),
      new THREE.MeshStandardMaterial({ color: 0xb5b0a4, roughness: 0.75 }));
    rim.position.set(13, 0.17, -14); rim.castShadow = true; rim.receiveShadow = true; hhT.add(rim);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), mat(T.poolCover, { roughness: 0.75 }));
    water.rotation.x = -Math.PI / 2; water.position.set(13, 0.2, -14); water.receiveShadow = true; hhT.add(water);
    const wet = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x0d1a22, roughness: 0.08, metalness: 0.7 }));
    wet.rotation.x = -Math.PI / 2; wet.position.set(12, 0.34, -13.2); hhT.add(wet);
    const la = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6),
      new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.8, roughness: 0.3 }));
    la.position.set(9.4, 0.7, -12.6); la.rotation.x = 0.5; hhT.add(la);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xe8e4d8, roughness: 0.85 }));
    ch.position.set(15.4, 0.45, -11.4); ch.castShadow = true; hhT.add(ch);
    addBox(260 + 13, 260 - 14, 4.6, 3.1, 0.3, 0.6);
    addBox(260 + 15.4, 260 - 11.4, 0.6, 0.6, 0.5, 0.5);
  }

  /* walkways */
  pathPlane(0, 260 - 12, 0, 260 - 16.5, 1.4, hhT);
  pathPlane(-3.2, 260 - 12.2, 0, 260 - 13, 1.2, hhT);

  /* backyard tree line */
  for (let i = 0; i < 70; i++) {
    const ang = rnd() * Math.PI * 2;
    const x = 2 + Math.cos(ang) * rr(24, 46);
    const z = -8 + Math.sin(ang) * rr(22, 40);
    if (Math.abs(x) < 21 && z > -32 && z < 14) continue;
    const tree = makeTreeLeaf(rr(0.9, 1.6));
    tree.position.set(x, 0, z); hhT.add(tree);
    colliders.push({ x0: 260 + x - 0.4, x1: 260 + x + 0.4, z0: 260 + z - 0.4, z1: 260 + z + 0.4, cy: 5, hh: 6 });
  }
  /* wooden fence */
  {
    const fenceM = new THREE.MeshStandardMaterial({ color: 0x4f4237, roughness: 0.95 });
    const mk = (x, z, len, horiz) => {
      const f = new THREE.Mesh(new THREE.BoxGeometry(horiz ? len : 0.14, 1.5, horiz ? 0.14 : len), fenceM);
      f.position.set(x, 0.75, z); f.castShadow = true; hhT.add(f);
    };
    mk(-6, -30, 24, true); mk(18, -30, 24, true);
    mk(-6, -20, 20, false); mk(18, -18, 24, false);
    colliders.push({ x0: 260 - 6, x1: 260 + 18, z0: 260 - 30.3, z1: 260 - 29.9, cy: 1, hh: 1.5 });
    colliders.push({ x0: 260 - 6, x1: 260 - 5.9, z0: 260 - 20, z1: 260, cy: 1, hh: 1.5 });
    colliders.push({ x0: 260 + 17.9, x1: 260 + 18.1, z0: 260 - 30, z1: 260 - 6, cy: 1, hh: 1.5 });
  }
  /* clothesline with drying sheets */
  {
    for (const x of [-1, 5]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x5c5850 }));
      p.position.set(x, 1.3, -22); hhT.add(p);
    }
    for (const x of [0.3, 2.2]) {
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.3),
        new THREE.MeshStandardMaterial({ color: 0xd9d5cc, roughness: 0.95, side: THREE.DoubleSide, transparent: true, opacity: 0.96 }));
      sheet.position.set(x, 1.85, -22); hhT.add(sheet);
    }
  }
}

/* ================= HAWKINS MIDDLE SCHOOL (west, x ≈ -260, z ≈ 260) ================= */
const scT = new THREE.Group(); scT.position.set(-260, 0, 260); scene.add(scT);
{
  const lot = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), mat(T.asphalt, { color: 0x36383e }));
  lot.material.map = T.asphalt.clone(); lot.material.map.needsUpdate = true; lot.material.map.repeat.set(8, 6);
  lot.rotation.x = -Math.PI / 2; lot.position.set(6, 0.012, 10); lot.receiveShadow = true; scT.add(lot);

  const bld = new THREE.Mesh(new THREE.BoxGeometry(46, 9, 18), mat(T.brick, { color: 0x8a4638 }));
  bld.position.set(0, 4.5, -20); bld.castShadow = true; bld.receiveShadow = true; scT.add(bld);
  addBox(-260, 240, 23.3, 9.3, 4.5, 5);
  const roof = gableRoof(47, 18.6, 3.4, 0x302a28); roof.position.set(0, 9, -20); scT.add(roof);

  const ent = new THREE.Mesh(new THREE.BoxGeometry(8, 5.4, 5), mat(T.brick, { color: 0x7e3f33 }));
  ent.position.set(0, 2.7, -6.5); ent.castShadow = true; scT.add(ent);
  addBox(-260, 253.5, 4.3, 2.6, 2.7, 3);
  const entRoof = gableRoof(8.4, 5.4, 1.4, 0x302a28); entRoof.position.set(0, 5.4, -6.5); scT.add(entRoof);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x2a3540, metalness: 0.5, roughness: 0.4 });
  for (const dx of [-1.4, 0, 1.4]) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, 0.08), doorMat);
    d.position.set(dx, 1.3, -3.95); scT.add(d);
  }
  const doorGlow = new THREE.PointLight(0xbfd4ff, 5, 10, 1.8); doorGlow.position.set(-260, 262, 256.5); scene.add(doorGlow);
  const transom = windowPlane(5.4, 0.8, T.windowCool); transom.position.set(0, 4.6, -3.94); scT.add(transom);

  const frontZ = -10.94;
  for (let i = -4; i <= 4; i++) {
    if (Math.abs(i) < 1.5) continue;
    const wx = i * 4.6;
    for (const [wy, t2] of [[4.6, (i === -3 ? T.windowLit : i === 2 ? T.windowCool : T.windowDark)], [1.9, T.windowDark]]) {
      const win = windowPlane(2.2, 1.7, t2);
      win.position.set(wx, wy, frontZ); win.rotation.y = Math.PI; scT.add(win);
    }
    if (i === -3 || i === 2) {
      const pl = new THREE.PointLight(i === -3 ? 0xffb36b : 0x9db8e8, 4, 10, 1.9);
      pl.position.set(-260 + wx, 4.6, 260 - 11.7); scene.add(pl);
    }
  }

  /* HAWKINS MIDDLE SCHOOL sign */
  {
    const postM = new THREE.MeshStandardMaterial({ color: 0x3a3a38, roughness: 0.8 });
    for (const px of [-3, 3]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.2, 0.16), postM);
      p.position.set(px, 1.1, 2); p.castShadow = true; scT.add(p);
    }
    const face = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.9, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
    face.position.set(0, 2.2, 2); face.castShadow = true; scT.add(face);
    for (const sZ of [2.11, 1.89]) {
      const art = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.6),
        new THREE.MeshStandardMaterial({ map: T.sign, roughness: 0.75 }));
      art.position.set(0, 2.2, sZ); art.rotation.y = sZ > 2 ? 0 : Math.PI; scT.add(art);
    }
    addBox(-260, 262, 3.8, 0.3, 1.5, 1.5);
    const sl = new THREE.SpotLight(0xfff4d8, 22, 16, THREE.MathUtils.degToRad(50), 0.5, 1.5);
    sl.position.set(-260, 6.4, 260); sl.target.position.set(-260, 2.2, 262); scene.add(sl); scene.add(sl.target);
  }

  /* basketball hoop */
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 3.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x38424e, roughness: 0.7 }));
    pole.position.set(20, 1.8, 24); pole.castShadow = true; scT.add(pole);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xdfe4e8, roughness: 0.5 }));
    board.position.set(20, 3.5, 22.9); board.castShadow = true; scT.add(board);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xc73a2e, roughness: 0.5, metalness: 0.4 }));
    rim.position.set(20, 3.05, 22.65); rim.rotation.x = Math.PI / 2; scT.add(rim);
    addBox(-260 + 20, 260 + 24, 0.3, 0.3, 2, 2);
    const court = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), mat(T.asphalt, { color: 0x43454b }));
    court.rotation.x = -Math.PI / 2; court.position.set(20, 0.015, 24); court.receiveShadow = true; scT.add(court);
  }

  /* flag pole */
  {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 9, 8),
      new THREE.MeshStandardMaterial({ color: 0xb9bec4, metalness: 0.7, roughness: 0.35 }));
    p.position.set(-12, 4.5, 0); p.castShadow = true; scT.add(p);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x2a3550, roughness: 0.9, side: THREE.DoubleSide }));
    flag.position.set(-11.2, 8, 0); scT.add(flag);
    addBox(-260 - 12, 260, 0.2, 0.2, 4.5, 5);
  }

  /* picnic benches */
  for (const [bx, bz] of [[-8, 6], [-8, 12], [-14, 9]]) {
    const g = new THREE.Group();
    const woodM = new THREE.MeshStandardMaterial({ color: 0x5c4a38, roughness: 0.9 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.8), woodM);
    top.position.y = 0.75; top.castShadow = true; g.add(top);
    for (const sz of [-0.85, 0.85]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.07, 0.34), woodM);
      bench.position.set(0, 0.45, sz); g.add(bench);
    }
    for (const lx of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x3a3a3a }));
      leg.position.set(lx, 0.37, 0); g.add(leg);
    }
    g.position.set(bx, 0, bz); g.rotation.y = 0.15; scT.add(g);
    addBox(-260 + bx, 260 + bz, 1.3, 1, 0.6, 0.6);
  }
  /* bikes at the rack */
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: pick([0x7a2020, 0x1d3a6e, 0x2d5a2a]), metalness: 0.4, roughness: 0.5 });
    for (const wx of [-0.5, 0.5]) {
      const w = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 8, 16), m);
      w.position.set(wx, 0.34, 0); w.rotation.y = Math.PI / 2; g.add(w);
    }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.05), m);
    bar.position.set(0, 0.66, 0); g.add(bar);
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), m);
    st.position.set(0.1, 0.88, 0.34); st.rotation.x = 0.5; g.add(st);
    g.position.set(-4 + i * 0.8, 0, 18 + (i % 2) * 0.6); g.rotation.y = 1.4; scT.add(g);
  }

  /* front walk */
  const p1 = new THREE.Mesh(new THREE.PlaneGeometry(3, 26), mat(T.concrete, { color: 0x50524f }));
  p1.rotation.x = -Math.PI / 2; p1.position.set(0, 0.014, 8); p1.receiveShadow = true; scT.add(p1);

  /* surrounding woods */
  for (let i = 0; i < 60; i++) {
    const x = rr(-70, 80), z = rr(-50, 70);
    if (x > -32 && x < 40 && z > -34 && z < 34) continue;
    const tree = makeTreeLeaf(rr(0.9, 1.5));
    tree.position.set(x, 0, z); scT.add(tree);
    colliders.push({ x0: -260 + x - 0.4, x1: -260 + x + 0.4, z0: 260 + z - 0.4, z1: 260 + z + 0.4, cy: 5, hh: 6 });
  }
  lampPost(-260 + 10, 260 + 14);
  lampPost(-260 - 8, 260 + 20);
}

/* ================= connecting roads between zones ================= */
function connectRoad(x0, z0, x1, z1) {
  const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz), ang = Math.atan2(dx, dz);
  const mid = new THREE.Mesh(new THREE.PlaneGeometry(6.5, len, 1, Math.max(4, Math.floor(len / 4))),
    mat(T.road));
  mid.material.map = T.road.clone(); mid.material.map.needsUpdate = true;
  mid.material.map.repeat.set(1, Math.max(2, Math.floor(len / 9)));
  mid.rotation.x = -Math.PI / 2;
  mid.position.set((x0 + x1) / 2, 0.018, (z0 + z1) / 2);
  mid.rotation.z = -ang;
  mid.receiveShadow = true;
  scene.add(mid);
  for (let t = 0.08; t < 0.95; t += 0.06) {
    for (const side of [-1, 1]) {
      if (rnd() < 0.4) continue;
      const nx = x0 + dx * t + Math.cos(ang) * side * rr(7.5, 16);
      const nz = z0 + dz * t - Math.sin(ang) * side * rr(7.5, 16);
      const tree = (rnd() < 0.6 ? makeTreePine : makeTreeLeaf)(rr(0.9, 1.7));
      tree.position.set(nx, 0, nz); scene.add(tree);
      colliders.push({ x0: nx - 0.35, x1: nx + 0.35, z0: nz - 0.35, z1: nz + 0.35, cy: 5, hh: 6 });
    }
  }
}
connectRoad(-5, -235, -262, 292);      /* Mirkwood -> School */
connectRoad(-226, 296, 208, 292);      /* southern back road: School <-> Harrington */
connectRoad(28, -238, 214, 262);       /* Mirkwood -> Harrington driveway */
lampPost(-130, -40); lampPost(-180, 90);
lampPost(120, 40); lampPost(70, 180);
lampPost(-130, 296); lampPost(60, 296);

/* ================= THE CITY (far south skyline, always glowing) ================= */
{
  const g = new THREE.Group(); g.position.set(60, 0, 620); scene.add(g);
  for (let i = 0; i < 46; i++) {
    const x = rr(-320, 320), w = rr(14, 34), h = rr(24, 120);
    const t = T.cityTex.clone(); t.needsUpdate = true; t.repeat.set(Math.ceil(w / 10), Math.ceil(h / 16));
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w),
      new THREE.MeshStandardMaterial({
        color: 0x05070c, roughness: 1,
        emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.75, fog: false
      }));
    b.position.set(x, h / 2 - 2, rr(-160, 160));
    g.add(b);
  }
  const beacons = [];
  for (let i = 0; i < 6; i++) {
    const x = rr(-300, 300), h = rr(120, 150);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff4040, fog: false, transparent: true }));
    s.scale.setScalar(6); s.position.set(x, h, rr(-140, 140));
    g.add(s); beacons.push(s.material);
  }
  window.__beacons = beacons;
}

/* ================= POIs (photo subjects) ================= */
const POIS = [
  { name: 'Mirkwood Road', x: 10.5, z: -240, r: 30 },
  { name: 'The Police Cruiser', x: 6.2, z: -242, r: 12 },
  { name: 'MISSING: Will Byers Posters', x: -4.6, z: -260 + 10, r: 8 },
  { name: 'The Harrington Pool', x: 260 + 13, z: 260 - 14, r: 10 },
  { name: 'The Patio Lights', x: 260 - 3.2, z: 260 - 16.5, r: 10 },
  { name: "Steve's Window", x: 262.8, z: 260 - 11.5, r: 12 },
  { name: 'Hawkins Middle Sign', x: -260, z: 262, r: 10 },
  { name: 'The Basketball Hoop', x: -260 + 20, z: 260 + 24, r: 10 },
  { name: 'The Bikes', x: -260 - 2.8, z: 260 + 18, r: 8 },
];
const found = new Set();

/* ================= player physics ================= */
const player = {
  pos: new THREE.Vector3(0, 0, -300),
  vel: new THREE.Vector3(),
  onGround: true,
  yaw: Math.PI, pitch: -0.05,
  bob: 0,
  eye: 1.7,
};
const KEYS = {};
let started = false, paused = false, cameraMode = false, albumOpen = false, menuOpen = true, mapOpen = false;

addEventListener('keydown', (e) => {
  KEYS[e.code] = true;
  if (!started) return;
  if (e.code === 'Tab') e.preventDefault();
  if (albumOpen) { if (e.code === 'Tab' || e.code === 'KeyB') toggleAlbum(); return; }
  if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3') {
    if (e.code === 'Digit1') travel('mirkwood');
    if (e.code === 'Digit2') travel('harrington');
    if (e.code === 'Digit3') travel('school');
    return;
  }
  if (e.code === 'Escape' && mapOpen) { toggleMap(); return; }
  if (menuOpen || mapOpen) return;
  if (e.code === 'KeyE' || e.code === 'KeyC') toggleCameraMode();
  if (e.code === 'KeyF') takePhoto();
  if (e.code === 'KeyT') toggleTorch();
  if (e.code === 'KeyM') toggleMap();
  if (e.code === 'KeyR') loadFilm();
  if (e.code === 'Digit1') travel('mirkwood');
  if (e.code === 'Digit2') travel('harrington');
  if (e.code === 'Digit3') travel('school');
});
addEventListener('keyup', (e) => KEYS[e.code] = false);

const cvs = renderer.domElement;
cvs.addEventListener('click', () => {
  if (menuOpen || albumOpen || mapOpen) return;
  if (!document.pointerLockElement) { cvs.requestPointerLock(); return; }
  if (cameraMode) takePhoto(); else toggleCameraMode();
});
cvs.addEventListener('mousedown', (e) => {
  if (e.button === 2 && document.pointerLockElement === cvs && started) toggleTorch();
});
addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== cvs) return;
  player.yaw -= e.movementX * 0.0023;
  player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch - e.movementY * 0.0023));
});
document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === cvs;
  paused = !locked;
  if (started && !locked && !menuOpen && !albumOpen && !mapOpen) showPause();
  if (locked) document.getElementById('pause').classList.add('hidden');
});

/* ================= audio ================= */
let AC = null;
const audio = () => AC || (AC = new (window.AudioContext || window.webkitAudioContext)());
function shutterSound() {
  try {
    const a = audio(), t = a.currentTime;
    const click = (dt, f, dur) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.12, t + dt); g.gain.exponentialRampToValueAtTime(0.0001, t + dt + dur);
      o.connect(g).connect(a.destination); o.start(t + dt); o.stop(t + dt + dur);
    };
    click(0, 2800, 0.03); click(0.06, 1800, 0.05);
    const buf = a.createBufferSource(), nb = a.createBuffer(1, 2205, a.sampleRate);
    const d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    buf.buffer = nb;
    const g2 = a.createGain(); g2.gain.value = 0.14;
    buf.connect(g2).connect(a.destination); buf.start(t);
  } catch (err) { /* audio unavailable */ }
}
function startWind() {
  try {
    const a = audio();
    const buf = a.createBuffer(1, a.sampleRate * 4, a.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
    const g = a.createGain(); g.gain.value = 0.05;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (err) { /* audio unavailable */ }
}

/* ================= photo system ================= */
let film = 24;
const photos = [];
const flashEl = document.getElementById('flash');
const hintEl = document.getElementById('hint');
let hintTimer = null;
function showHint(txt, ms = 2600) {
  hintEl.textContent = txt; hintEl.style.opacity = 1;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hintEl.style.opacity = 0, ms);
}
function toast(txt, red = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (red ? ' red' : ''); t.textContent = txt;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .5s'; t.style.opacity = 0; setTimeout(() => t.remove(), 500); }, 2800);
}
function loadFilm() {
  film = 24;
  document.getElementById('filmTag').textContent = 'FILM: 24 exposures';
  toast('NEW ROLL LOADED — KODACHROME 64');
}
function takePhoto() {
  if (!started || albumOpen || mapOpen || menuOpen) return;
  if (film <= 0) { toast('FILM IS EMPTY — PRESS R TO LOAD A NEW ROLL', true); return; }
  film--;
  document.getElementById('filmTag').textContent = `FILM: ${film} exposure${film !== 1 ? 's' : ''}`;
  shutterSound();
  flashEl.style.transition = 'none'; flashEl.style.opacity = 0.9;
  requestAnimationFrame(() => { flashEl.style.transition = 'opacity .35s'; flashEl.style.opacity = 0; });
  renderer.render(scene, camera);
  const data = renderer.domElement.toDataURL('image/jpeg', 0.82);
  photos.push({ data, subjects: [] });
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir);
  const fwd = new THREE.Vector3(dir.x, 0, dir.z).normalize();
  const hits = [];
  for (const p of POIS) {
    if (found.has(p.name)) continue;
    const dx = p.x - player.pos.x, dz = p.z - player.pos.z;
    if (Math.hypot(dx, dz) > p.r) continue;
    if (new THREE.Vector3(dx, 0, dz).normalize().dot(fwd) < 0.35) continue;
    found.add(p.name); hits.push(p.name);
  }
  if (hits.length) {
    photos[photos.length - 1].subjects = hits.slice();
    hits.forEach(h => toast('SUBJECT CAPTURED — ' + h.toUpperCase()));
    document.getElementById('subjects').textContent = `SUBJECTS PHOTOGRAPHED: ${found.size} / ${POIS.length}`;
    if (found.size === POIS.length) setTimeout(() => toast('FOTOLOG COMPLETE — PRESS TAB TO LOOK THROUGH YOUR PRINTS', true), 1300);
  }
  if (film === 0) showHint('FILM IS EMPTY — PRESS R', 3000);
}

/* ================= UI toggles ================= */
function toggleCameraMode() {
  cameraMode = !cameraMode;
  document.getElementById('viewfinder').classList.toggle('on', cameraMode);
}
function toggleTorch() {
  flashlight.intensity = flashlight.intensity ? 0 : 57;
  showHint(flashlight.intensity ? 'FLASHLIGHT ON' : 'FLASHLIGHT OFF', 1400);
}
function toggleAlbum() {
  albumOpen = !albumOpen;
  const el = document.getElementById('album');
  el.classList.toggle('hidden', !albumOpen);
  if (albumOpen) { renderAlbum(); document.exitPointerLock(); }
  else if (started && !mapOpen && !menuOpen) cvs.requestPointerLock();
}
function toggleMap() {
  mapOpen = !mapOpen;
  const el = document.getElementById('menu');
  el.classList.toggle('hidden', !mapOpen || !started);
  if (mapOpen) document.exitPointerLock();
  else if (started) cvs.requestPointerLock();
}
function showPause() { document.getElementById('pause').classList.remove('hidden'); }

function renderAlbum() {
  const grid = document.getElementById('albumGrid');
  grid.innerHTML = '';
  document.getElementById('albumEmpty').style.display = photos.length ? 'none' : 'block';
  photos.forEach((p, i) => {
    const w = document.createElement('div'); w.className = 'photoWrap';
    const img = document.createElement('img'); img.src = p.data;
    const st = document.createElement('div'); st.className = 'stamp';
    st.textContent = `NOV '83 ${String(i + 1).padStart(2, '0')}` + (p.subjects.length ? ' · ' + p.subjects.join(' + ').toUpperCase() : '');
    const del = document.createElement('div'); del.className = 'del'; del.textContent = '\u2715';
    del.onclick = () => { photos.splice(i, 1); renderAlbum(); };
    w.append(img, st, del); grid.appendChild(w);
  });
}

/* ================= travel ================= */
const SPAWNS = {
  mirkwood: { pos: [10.5, -300], yaw: Math.PI, name: 'MIRKWOOD' },
  harrington: { pos: [250, 224], yaw: Math.PI, name: 'HARRINGTON HOUSE — BACKYARD' },
  school: { pos: [-252, 284], yaw: -0.15, name: 'HAWKINS MIDDLE SCHOOL' },
};
const fade = document.getElementById('fade');
function travel(key) {
  if (!SPAWNS[key]) return;
  menuOpen = false; mapOpen = false;
  document.getElementById('menu').classList.add('hidden');
  fade.style.opacity = 1;
  setTimeout(() => {
    const s = SPAWNS[key];
    player.pos.set(s.pos[0], 0, s.pos[1]);
    player.vel.set(0, 0, 0);
    player.yaw = s.yaw; player.pitch = -0.03;
    document.getElementById('locTag').textContent = s.name;
    fade.style.opacity = 0;
    if (started) cvs.requestPointerLock();
    showLocationHint(key);
  }, 650);
}
function showLocationHint(key) {
  const hints = {
    mirkwood: "MIRKWOOD — 11:47 PM. Hopper's cruiser sits on the shoulder. Photograph 3 subjects.",
    harrington: 'HARRINGTON BACKYARD — the pool sleeps under its winter cover. Try not to be seen.',
    school: "HAWKINS MIDDLE — the lot is empty. The party's bikes are still racked outside.",
  };
  showHint(hints[key], 5200);
}

document.querySelectorAll('.card').forEach(c => {
  c.addEventListener('click', () => {
    if (!started) {
      started = true;
      startWind();
      if (AC && AC.state === 'suspended') AC.resume();
    }
    travel(c.dataset.loc);
  });
});
document.getElementById('pause').addEventListener('click', () => {
  document.getElementById('pause').classList.add('hidden');
  cvs.requestPointerLock();
});

/* ================= move & collide ================= */
function resolveCollisions() {
  const r = 0.38;
  for (const c of colliders) {
    if (player.pos.y + 1.6 < c.cy - c.hh || player.pos.y > c.cy + c.hh) continue;
    const nx = Math.max(c.x0, Math.min(player.pos.x, c.x1));
    const nz = Math.max(c.z0, Math.min(player.pos.z, c.z1));
    const dx = player.pos.x - nx, dz = player.pos.z - nz;
    const d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      if (d2 < 1e-6) {
        const cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
        if ((c.x1 - c.x0) > (c.z1 - c.z0))
          player.pos.z = (player.pos.z < cz ? c.z0 - r : c.z1 + r);
        else
          player.pos.x = (player.pos.x < cx ? c.x0 - r : c.x1 + r);
      } else {
        const d = Math.sqrt(d2);
        player.pos.x += (dx / d) * (r - d);
        player.pos.z += (dz / d) * (r - d);
      }
    }
  }
}

const clock = new THREE.Clock();
let stepT = 0;
function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  const moveX = (KEYS.KeyD || KEYS.ArrowRight ? 1 : 0) - (KEYS.KeyA || KEYS.ArrowLeft ? 1 : 0);
  const moveZ = (KEYS.KeyW || KEYS.ArrowUp ? 1 : 0) - (KEYS.KeyS || KEYS.ArrowDown ? 1 : 0);
  const sprint = KEYS.ShiftLeft || KEYS.ShiftRight;
  const active = started && !menuOpen && !albumOpen && !mapOpen && !paused;

  if (active) {
    const speed = sprint ? 7.4 : 4.2;
    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    let wx = 0, wz = 0;
    if (moveZ || moveX) {
      const len = Math.hypot(moveX, moveZ);
      const fx = (-sin * moveZ + cos * moveX) / len;
      const fz = (-cos * moveZ - sin * moveX) / len;
      wx = fx * speed; wz = fz * speed;
    }
    player.vel.x += (wx - player.vel.x) * Math.min(1, dt * 9);
    player.vel.z += (wz - player.vel.z) * Math.min(1, dt * 9);
    if (KEYS.Space && player.onGround) {
      player.vel.y = 7.6; player.onGround = false;
    }
    player.vel.y -= 21 * dt;
    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.z * dt;
    player.pos.y += player.vel.y * dt;
    if (player.pos.y <= 0) {
      if (!player.onGround && player.vel.y < -8) player.bob = -0.2;
      player.pos.y = 0; player.vel.y = 0; player.onGround = true;
    }
    resolveCollisions();

    const hs = Math.hypot(player.vel.x, player.vel.z);
    if (player.onGround && hs > 0.6) {
      stepT += dt * hs;
      if (stepT > 2.1) {
        stepT = 0;
        try {
          const a = audio(), tt = a.currentTime;
          const o = a.createOscillator(); o.type = 'triangle'; o.frequency.value = rr(70, 110);
          const g = a.createGain();
          g.gain.setValueAtTime(0.045, tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.09);
          o.connect(g).connect(a.destination); o.start(tt); o.stop(tt + 0.1);
        } catch (err) { /* audio unavailable */ }
      }
    }
    player.bob += dt * 3.2;
  }

  const hspeed = Math.hypot(player.vel.x, player.vel.z);
  const walking = hspeed > 0.5 && player.onGround;
  const bobAmt = walking ? Math.sin(player.bob * 3.4) * 0.035 * Math.min(1, hspeed / 4) : 0;
  const sway = walking ? Math.sin(player.bob * 1.7) * 0.012 : 0;
  camera.position.set(player.pos.x, player.pos.y + player.eye + bobAmt, player.pos.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.set(player.pitch, player.yaw, sway * 0.6);

  const targetFov = cameraMode ? 55 : (sprint && hspeed > 5 ? 76 : 72);
  camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 8);
  camera.updateProjectionMatrix();

  moon.position.set(player.pos.x + 60, 120, player.pos.z + 40);
  moon.target.position.set(player.pos.x, 0, player.pos.z);

  for (const c of clouds) {
    c.position.x += dt * 2.1;
    if (c.position.x > 750) c.position.x = -750;
  }
  if (window.__fireflies) {
    const p = window.__fireflies.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.array[i * 3 + 1] += Math.sin(t * 1.4 + i) * 0.002;
      p.array[i * 3] += Math.cos(t * 0.8 + i) * 0.002;
    }
    p.needsUpdate = true;
    window.__fireflies.material.opacity = 0.5 + Math.sin(t * 2.2) * 0.25;
  }
  if (window.__barLights) {
    const ph = (t * 3.4) % 2;
    window.__barLights[0].emissiveIntensity = ph < 1 ? 4 : 0;
    window.__barLights[1].emissiveIntensity = ph < 1 ? 0 : 4;
    if (window.__beacon) window.__beacon.intensity = ph < 1 ? 9 : 0;
  }
  if (window.__beacons) window.__beacons.forEach((m, i) => m.opacity = (Math.sin(t * 2 + i) > 0 ? 0.9 : 0.1));

  renderer.render(scene, camera);
}
tick();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.getElementById('subjects').textContent = `SUBJECTS PHOTOGRAPHED: 0 / ${POIS.length}`;
