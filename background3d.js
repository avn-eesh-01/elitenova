import * as THREE from 'three';

class Background3D {
  constructor() {
    this.container = document.getElementById('canvas-container');
    if (!this.container) return;

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
    this.camera.position.z = 14;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.buildHeroAura();
    this.buildStarfield();
    this.setupListeners();

    this.clock = new THREE.Clock();
    this.animate();
  }

  buildHeroAura() {
    const geometry = new THREE.PlaneGeometry(8.2, 8.2, 1, 1);
    this.auraMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          uv.x *= 0.86;

          float radius = length(uv);
          float angle = atan(uv.y, uv.x);

          float pulse = 0.03 * sin(uTime * 0.55 + angle * 2.0);
          float halo = smoothstep(1.05, 0.18, radius);
          float core = smoothstep(0.54, 0.0, radius);

          float ringRadius = 0.56 + pulse;
          float ring = smoothstep(0.12, 0.0, abs(radius - ringRadius));
          float arc = smoothstep(-0.2, 0.92, sin(angle - 0.55) + 0.24);

          float plume = smoothstep(0.82, 0.12, length(uv - vec2(-0.18, 0.08)));

          vec3 deep = vec3(0.18, 0.02, 0.38);
          vec3 mid = vec3(0.44, 0.12, 0.78);
          vec3 bright = vec3(0.83, 0.52, 1.0);

          vec3 color = deep * halo;
          color += mid * (core * 0.75 + plume * 0.4);
          color += bright * (ring * arc * 0.78 + core * 0.2);

          float alpha = halo * 0.08;
          alpha += core * 0.12;
          alpha += ring * arc * 0.25;
          alpha += plume * 0.05;

          if (alpha < 0.01) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    this.auraMesh = new THREE.Mesh(geometry, this.auraMaterial);
    this.auraMesh.position.set(0, 0.3, -4.5);
    this.scene.add(this.auraMesh);
  }

  buildStarfield() {
    const starCount = 1800;
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

      scales[i] = 0.7 + Math.random() * 1.8;
      speeds[i] = 5.5 + Math.random() * 10.5;
      drifts[i] = (Math.random() - 0.5) * 0.28;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    this.starPositions = positions;
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
          vAlpha = mix(0.24, 1.0, proximity);

          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aScale * (120.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 0.8, 4.8);
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
          vec3 color = mix(vec3(0.78, 0.78, 0.88), vec3(1.0), sparkle);

          gl_FragColor = vec4(color, (glow * 0.62 + sparkle * 0.42) * vAlpha);
        }
      `
    });

    this.starfield = new THREE.Points(geometry, this.starMaterial);
    this.scene.add(this.starfield);
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
      this.camera.position.z = 13.2;
      this.auraMesh.scale.set(0.82, 0.82, 1);
      this.auraBaseY = 0.15;
      this.auraMesh.position.set(0, this.auraBaseY, -4.5);
    } else if (this.width < 1024) {
      this.camera.position.z = 13.6;
      this.auraMesh.scale.set(0.92, 0.92, 1);
      this.auraBaseY = 0.22;
      this.auraMesh.position.set(0, this.auraBaseY, -4.5);
    } else {
      this.camera.position.z = 14;
      this.auraMesh.scale.set(1, 1, 1);
      this.auraBaseY = 0.3;
      this.auraMesh.position.set(0, this.auraBaseY, -4.5);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.elapsedTime;

    this.auraMaterial.uniforms.uTime.value = elapsedTime;
    this.starMaterial.uniforms.uTime.value = elapsedTime;

    this.mouseX += (this.targetX - this.mouseX) * 0.045;
    this.mouseY += (this.targetY - this.mouseY) * 0.045;

    this.auraMesh.rotation.z = Math.sin(elapsedTime * 0.16) * 0.06;
    this.auraMesh.position.x = this.mouseX * 0.35;
    this.auraMesh.position.y += ((this.auraBaseY - this.mouseY * 0.16) - this.auraMesh.position.y) * 0.07;

    const positions = this.starfield.geometry.attributes.position.array;
    for (let i = 0; i < this.starSpeeds.length; i += 1) {
      const index = i * 3;
      positions[index + 2] += this.starSpeeds[i] * delta;
      positions[index] += this.starDrifts[i] * delta;

      if (Math.abs(positions[index]) > 39) {
        this.starDrifts[i] *= -1;
      }

      if (positions[index + 2] > 10) {
        positions[index] = (Math.random() - 0.5) * 74;
        positions[index + 1] = (Math.random() - 0.44) * 46;
        positions[index + 2] = -72 - Math.random() * 18;
        this.starDrifts[i] = (Math.random() - 0.5) * 0.28;
      }
    }

    this.starfield.geometry.attributes.position.needsUpdate = true;
    this.starfield.rotation.z = Math.sin(elapsedTime * 0.06) * 0.025;
    this.starfield.position.x = this.mouseX * 0.6;
    this.starfield.position.y = -this.mouseY * 0.35;

    this.camera.position.x += (this.mouseX * 0.7 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouseY * 0.45 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

new Background3D();
