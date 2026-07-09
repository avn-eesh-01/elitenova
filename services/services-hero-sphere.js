/**
 * services-hero-sphere.js
 * Interactive Three.js wireframe sphere for the Services page hero.
 * Renders inside #hero-sphere-canvas.
 * Uses GSAP (loaded globally) for entrance & scroll animations.
 */
import * as THREE from 'three';

class ServicesHeroSphere {
  constructor() {
    this.container = document.getElementById('hero-sphere-canvas');
    if (!this.container) return;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.init();
  }

  /* ─── Setup ──────────────────────────────────────────────── */
  init() {
    this.width  = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
    this.camera.position.z = 5.2;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Main group (everything rotates together)
    this.sphereGroup = new THREE.Group();
    this.scene.add(this.sphereGroup);

    // Build scene components
    this.buildWireframeSphere();
    this.buildInnerGlow();
    this.buildParticles();
    this.buildOrbitalRings();

    // Clock
    this.clock = new THREE.Clock();

    // Events
    this.setupEvents();

    // GSAP entrance
    this.playEntrance();

    // Render loop
    this.animate();
  }

  /* ─── Wireframe icosahedron (2 layers) ──────────────────── */
  buildWireframeSphere() {
    // Primary wireframe
    const geo1 = new THREE.IcosahedronGeometry(1.28, 2);
    const mat1 = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    this.innerWire = new THREE.Mesh(geo1, mat1);
    this.sphereGroup.add(this.innerWire);

    // Outer shell — lower detail, softer
    const geo2 = new THREE.IcosahedronGeometry(1.36, 1);
    const mat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    this.outerWire = new THREE.Mesh(geo2, mat2);
    this.sphereGroup.add(this.outerWire);
  }

  /* ─── Fresnel-edge inner glow ───────────────────────────── */
  buildInnerGlow() {
    const geo = new THREE.SphereGeometry(1.15, 48, 48);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uColor1: { value: new THREE.Color(0x7c3aed) },
        uColor2: { value: new THREE.Color(0x1e0a3e) }
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vNormal;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 col = mix(uColor2, uColor1, fresnel);
          float pulse = 0.82 + 0.18 * sin(uTime * 0.6);
          gl_FragColor = vec4(col, fresnel * 0.55 * pulse);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide
    });
    this.glowMesh = new THREE.Mesh(geo, mat);
    this.sphereGroup.add(this.glowMesh);
  }

  /* ─── Particle dust in a spherical shell ────────────────── */
  buildParticles() {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const scales    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.35 + Math.random() * 1.4;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = Math.random() * 0.6 + 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale',   new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aScale;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position  = projectionMatrix * mv;
          gl_PointSize = aScale * (55.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 3.2);
          vAlpha = aScale;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(0.55, 0.36, 0.96, glow * vAlpha * 0.55);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.sphereGroup.add(this.particles);
  }

  /* ─── 3D orbital rings (subtle dashed torus outlines) ───── */
  buildOrbitalRings() {
    this.rings = [];

    const configs = [
      { radius: 1.85, rotation: [Math.PI / 2, 0, 0],         opacity: 0.18, dash: 0.18, gap: 0.12 },
      { radius: 1.95, rotation: [1.15, 0.55, -0.25],         opacity: 0.14, dash: 0.12, gap: 0.16 },
      { radius: 2.05, rotation: [1.15, -0.55, 0.35],         opacity: 0.11, dash: 0.10, gap: 0.18 }
    ];

    configs.forEach(cfg => {
      const curve  = new THREE.EllipseCurve(0, 0, cfg.radius, cfg.radius, 0, Math.PI * 2, false, 0);
      const pts2d  = curve.getPoints(180);
      const pts3d  = pts2d.map(p => new THREE.Vector3(p.x, p.y, 0));
      const geo    = new THREE.BufferGeometry().setFromPoints(pts3d);

      const mat = new THREE.LineDashedMaterial({
        color: 0x8b5cf6,
        dashSize: cfg.dash,
        gapSize: cfg.gap,
        transparent: true,
        opacity: cfg.opacity
      });

      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      line.rotation.set(...cfg.rotation);
      this.sphereGroup.add(line);
      this.rings.push(line);
    });
  }

  /* ─── Event listeners ───────────────────────────────────── */
  setupEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', e => {
      this.targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
      this.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  onResize() {
    this.width  = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /* ─── GSAP entrance animation ───────────────────────────── */
  playEntrance() {
    const gsap = window.gsap;
    if (!gsap) return;

    // Start hidden
    this.sphereGroup.scale.set(0, 0, 0);
    this.sphereGroup.rotation.y = -Math.PI * 0.5;

    gsap.to(this.sphereGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.6,
      ease: 'elastic.out(1, 0.55)',
      delay: 0.4
    });

    gsap.to(this.sphereGroup.rotation, {
      y: 0,
      duration: 2.0,
      ease: 'power3.out',
      delay: 0.4
    });

    // Animate orbit nodes in via CSS classes (handled in HTML)
    gsap.utils.toArray('.orbit-node').forEach((node, i) => {
      gsap.fromTo(node,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.9 + i * 0.12, ease: 'back.out(1.7)' }
      );
    });

    // Animate SVG orbital rings
    gsap.utils.toArray('.orbit-rings-svg ellipse').forEach((ring, i) => {
      const len = ring.getTotalLength ? ring.getTotalLength() : 1260;
      gsap.fromTo(ring,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 2.0, delay: 0.6 + i * 0.2, ease: 'power2.inOut' }
      );
    });

    // Animate center label
    gsap.fromTo('.sphere-center-label',
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.9, delay: 1.1, ease: 'back.out(1.7)' }
    );
  }

  /* ─── Render loop ───────────────────────────────────────── */
  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // Update uniforms
    if (this.glowMesh)  this.glowMesh.material.uniforms.uTime.value = elapsed;
    if (this.particles) this.particles.material.uniforms.uTime.value = elapsed;

    // Smooth mouse lerp
    this.mouseX += (this.targetX - this.mouseX) * 0.04;
    this.mouseY += (this.targetY - this.mouseY) * 0.04;

    // Auto-rotation
    this.sphereGroup.rotation.y += 0.002;
    this.sphereGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.06;

    // Counter-rotate wireframes for visual complexity
    if (this.innerWire) this.innerWire.rotation.y -= 0.001;
    if (this.outerWire) this.outerWire.rotation.x += 0.0008;

    // Mouse parallax on camera
    this.camera.position.x += (this.mouseX * 0.5  - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouseY * 0.35 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

/* ─── Bootstrap ────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ServicesHeroSphere());
} else {
  new ServicesHeroSphere();
}
