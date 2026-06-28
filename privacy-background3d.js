import * as THREE from 'three';

class PrivacyBackground3D {
  constructor() {
    this.container = document.getElementById('canvas-container');
    if (!this.container || !document.body.classList.contains('privacy-page')) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(54, this.aspect, 0.1, 120);
    this.camera.position.set(0, 0, 14);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.buildStarfield();
    this.buildFlowingLines();
    this.buildGlowParticles();
    this.setupListeners();

    this.clock = new THREE.Clock();
    this.animate();
  }

  buildStarfield() {
    const starCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const scales = new Float32Array(starCount);
    const speeds = new Float32Array(starCount);
    const drifts = new Float32Array(starCount);

    for (let i = 0; i < starCount; i += 1) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * 74;
      positions[index + 1] = (Math.random() - 0.44) * 46;
      positions[index + 2] = -Math.random() * 72 - 4;

      scales[i] = 0.6 + Math.random() * 1.6;
      speeds[i] = 4.5 + Math.random() * 9;
      drifts[i] = (Math.random() - 0.5) * 0.24;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    this.starSpeeds = speeds;
    this.starDrifts = drifts;

    this.starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float aScale;
        varying float vAlpha;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float proximity = 1.0 - clamp((-mvPosition.z - 6.0) / 80.0, 0.0, 1.0);
          vAlpha = mix(0.18, 0.9, proximity);

          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aScale * (110.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 0.7, 4.2);
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float glow = smoothstep(0.5, 0.0, dist);
          float sparkle = smoothstep(0.12, 0.0, dist);
          vec3 color = mix(vec3(0.72, 0.62, 0.92), vec3(0.95, 0.82, 1.0), sparkle);

          gl_FragColor = vec4(color, (glow * 0.55 + sparkle * 0.38) * vAlpha);
        }
      `
    });

    this.starfield = new THREE.Points(geometry, this.starMaterial);
    this.scene.add(this.starfield);
  }

  buildFlowingLines() {
    this.lineGroup = new THREE.Group();
    const lineCount = 7;
    const pointCount = 90;

    for (let l = 0; l < lineCount; l += 1) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const hue = 0.76 + l * 0.015;
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.82, 0.58),
        transparent: true,
        opacity: 0.18 + l * 0.035,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(geometry, material);
      line.userData = {
        lineIndex: l,
        phase: l * 0.85,
        amplitude: 0.45 + l * 0.08
      };
      this.lineGroup.add(line);
    }

    this.lineGroup.position.set(4.2, 0.2, -3.5);
    this.lineGroup.rotation.z = -0.08;
    this.scene.add(this.lineGroup);
  }

  buildGlowParticles() {
    const particleCount = 320;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;
      positions[index] = 1.8 + Math.random() * 5.5;
      positions[index + 1] = (Math.random() - 0.5) * 14;
      positions[index + 2] = -Math.random() * 8 - 1.5;

      scales[i] = 0.8 + Math.random() * 2.4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.particlePhases = phases;
    this.particleBasePositions = positions.slice();

    this.particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.55 + aPhase) * 0.35;
          pos.x += cos(uTime * 0.35 + aPhase * 1.4) * 0.18;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vAlpha = 0.35 + 0.45 * (0.5 + 0.5 * sin(uTime * 0.8 + aPhase));

          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aScale * (95.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 6.5);
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float glow = smoothstep(0.5, 0.0, dist);
          vec3 color = mix(vec3(0.55, 0.22, 0.95), vec3(0.88, 0.62, 1.0), glow);

          gl_FragColor = vec4(color, glow * vAlpha);
        }
      `
    });

    this.particles = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  updateFlowingLines(time) {
    this.lineGroup.children.forEach((line) => {
      const positions = line.geometry.attributes.position.array;
      const { lineIndex, phase, amplitude } = line.userData;
      const pointCount = positions.length / 3;

      for (let i = 0; i < pointCount; i += 1) {
        const t = i / (pointCount - 1);
        const y = (t - 0.5) * 13;
        const wave = Math.sin(t * 5.5 + time * 0.55 + phase) * amplitude;
        const ripple = Math.cos(t * 3.2 + time * 0.38 + phase * 0.6) * 0.28;
        const x = wave + lineIndex * 0.14;
        const z = ripple - 1.2 - lineIndex * 0.06;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }

      line.geometry.attributes.position.needsUpdate = true;
    });
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;

      this.camera.aspect = this.aspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.adjustForViewport();
    });

    window.addEventListener('mousemove', (event) => {
      this.targetX = (event.clientX - this.width / 2) / (this.width / 2);
      this.targetY = (event.clientY - this.height / 2) / (this.height / 2);
    });

    this.adjustForViewport();
  }

  adjustForViewport() {
    if (this.width < 768) {
      this.camera.position.set(0.4, 0, 13.2);
      this.lineGroup.position.set(2.4, 0.1, -3.5);
      this.lineGroup.scale.set(0.72, 0.72, 1);
    } else if (this.width < 1024) {
      this.camera.position.set(0.2, 0, 13.6);
      this.lineGroup.position.set(3.2, 0.15, -3.5);
      this.lineGroup.scale.set(0.86, 0.86, 1);
    } else {
      this.camera.position.set(0, 0, 14);
      this.lineGroup.position.set(4.2, 0.2, -3.5);
      this.lineGroup.scale.set(1, 1, 1);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.elapsedTime;

    this.starMaterial.uniforms.uTime.value = elapsedTime;
    this.particleMaterial.uniforms.uTime.value = elapsedTime;

    this.mouseX += (this.targetX - this.mouseX) * 0.045;
    this.mouseY += (this.targetY - this.mouseY) * 0.045;

    this.updateFlowingLines(elapsedTime);

    const starPositions = this.starfield.geometry.attributes.position.array;
    for (let i = 0; i < this.starSpeeds.length; i += 1) {
      const index = i * 3;
      starPositions[index + 2] += this.starSpeeds[i] * delta;
      starPositions[index] += this.starDrifts[i] * delta;

      if (Math.abs(starPositions[index]) > 39) {
        this.starDrifts[i] *= -1;
      }

      if (starPositions[index + 2] > 10) {
        starPositions[index] = (Math.random() - 0.5) * 74;
        starPositions[index + 1] = (Math.random() - 0.44) * 46;
        starPositions[index + 2] = -72 - Math.random() * 18;
        this.starDrifts[i] = (Math.random() - 0.5) * 0.24;
      }
    }

    this.starfield.geometry.attributes.position.needsUpdate = true;
    this.starfield.rotation.z = Math.sin(elapsedTime * 0.05) * 0.02;
    this.starfield.position.x = this.mouseX * 0.45;
    this.starfield.position.y = -this.mouseY * 0.28;

    this.lineGroup.rotation.y = Math.sin(elapsedTime * 0.12) * 0.06 + this.mouseX * 0.08;
    this.lineGroup.position.y = 0.2 - this.mouseY * 0.12;

    this.particles.rotation.z = Math.sin(elapsedTime * 0.04) * 0.015;
    this.particles.position.x = this.mouseX * 0.25;

    this.camera.position.x += (this.mouseX * 0.55 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouseY * 0.35 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0.8, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

new PrivacyBackground3D();
