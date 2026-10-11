import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates a soft, circular Gaussian star sprite.
 * Eliminates the artificial square pixel effect of default WebGL points.
 */
function createRoundStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.35, 'rgba(210, 235, 255, 0.55)');
  grad.addColorStop(0.65, 'rgba(120, 180, 255, 0.18)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates authentic James Webb Space Telescope (JWST) diffraction spikes.
 * JWST's signature optical feature: 6 dominant 60-degree hexagonal spikes
 * plus two subtle horizontal minor spikes from the secondary mirror strut.
 */
function createJWSTSpikeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128;
  const cy = 128;

  // Clear background
  ctx.clearRect(0, 0, 256, 256);

  // Helper to draw a single sharp diffraction spike
  const drawSpike = (angleRad, length, width, alpha) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);

    const grad = ctx.createLinearGradient(-length, 0, length, 0);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.4, `rgba(200, 230, 255, ${alpha * 0.4})`);
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(0.6, `rgba(200, 230, 255, ${alpha * 0.4})`);
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-length, 0);
    ctx.lineTo(0, -width);
    ctx.lineTo(length, 0);
    ctx.lineTo(0, width);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // 6 Primary Hexagonal Spikes at 30, 90, 150 deg (or 0, 60, 120 deg)
  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];
  angles.forEach((ang) => {
    drawSpike(ang, 120, 2.2, 0.95);
    drawSpike(ang, 80, 4.0, 0.35); // Softer halo spike
  });

  // 2 Faint Horizontal Strut Spikes (signature JWST artifact)
  drawSpike(Math.PI / 2, 85, 1.2, 0.45);

  // Brilliant Stellar Core
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
  coreGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  coreGrad.addColorStop(0.2, 'rgba(235, 245, 255, 0.9)');
  coreGrad.addColorStop(0.5, 'rgba(160, 210, 255, 0.35)');
  coreGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates distant lensed galaxy sprite (homage to JWST Deep Field)
 */
function createGalaxyTexture(tint = 'amber') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.35);
  ctx.scale(2.2, 0.85); // Elliptical disk

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 24);
  if (tint === 'amber') {
    grad.addColorStop(0.0, 'rgba(255, 230, 200, 0.85)');
    grad.addColorStop(0.3, 'rgba(240, 180, 120, 0.45)');
    grad.addColorStop(0.7, 'rgba(180, 100, 60, 0.15)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  } else {
    grad.addColorStop(0.0, 'rgba(220, 240, 255, 0.85)');
    grad.addColorStop(0.3, 'rgba(140, 190, 250, 0.45)');
    grad.addColorStop(0.7, 'rgba(70, 120, 200, 0.12)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function BackgroundCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    camera.position.set(0, 0, 120);

    // High performance WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Textures
    const starSprite = createRoundStarTexture();
    const jwstSpikeSprite = createJWSTSpikeTexture();
    const galaxySpriteAmber = createGalaxyTexture('amber');
    const galaxySpriteBlue = createGalaxyTexture('blue');

    // -------------------------------------------------------------
    // 1. AUTHENTIC NASA JWST NEBULA LAYER (Carina Nebula / Cosmic Cliffs)
    // -------------------------------------------------------------
    // Custom shader plane: situated on bottom-left and left-center.
    // Preserves clear dark negative space on top-right behind "EXPLORE THE ENDLESS".
    const textureLoader = new THREE.TextureLoader();
    const carinaTexture = textureLoader.load(
      '/assets/jwst_carina_cliffs.jpg',
      () => {
        // Texture loaded successfully
        renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        console.warn('JWST background texture fallback active:', err);
      }
    );

    const nebulaGeo = new THREE.PlaneGeometry(360, 220);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: carinaTexture },
        uOpacity: { value: 0.85 },
        uTime: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uOpacity;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(tDiffuse, vUv);

          // Astrophotographic tone adjustment: preserve rich amber and cyan dust
          vec3 col = tex.rgb;

          // Feathered mask: concentrates nebula on the lower-left & center
          // and smoothly transitions to deep space navy/black on the upper-right (title space)
          float leftWeight = smoothstep(0.92, 0.25, vUv.x);
          float bottomWeight = smoothstep(0.85, 0.15, vUv.y);
          float spatialMask = leftWeight * (0.4 + 0.6 * bottomWeight);

          // Vignette edge falloff to avoid harsh texture seams
          float edgeX = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
          float edgeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
          float edgeMask = edgeX * edgeY;

          float finalAlpha = uOpacity * spatialMask * edgeMask;

          gl_FragColor = vec4(col, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.set(-45, -30, -140); // Anchored to bottom/left
    scene.add(nebulaMesh);

    // -------------------------------------------------------------
    // 2. REALISTIC ASTRONOMICAL STARFIELD (Natural Distribution)
    // -------------------------------------------------------------
    // Thousands of tiny pinpoint stars (no square pixels!)
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    // Stellar spectral classification colors (O, B, A, F, G, K, M)
    const spectralColors = [
      new THREE.Color(0xdbeafe), // Blue-white (O/B type) - 30%
      new THREE.Color(0xf8fafc), // Pure white (A type) - 40%
      new THREE.Color(0xfff7ed), // Warm white (F type) - 15%
      new THREE.Color(0xfef3c7), // Solar gold (G type) - 10%
      new THREE.Color(0xfecaca)  // Amber/Red dwarf (M type) - 5%
    ];

    for (let i = 0; i < starCount; i++) {
      // Natural non-uniform astronomical distribution:
      // More stars clustered toward galactic mid-plane, irregular voids
      const clusterOffset = (Math.random() - 0.5) * 35;
      const x = (Math.random() - 0.5) * 650 + (Math.sin(i * 0.05) * 25);
      const y = (Math.random() - 0.5) * 450 + clusterOffset;
      const z = (Math.random() - 0.5) * 300 - 30;

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      // Realistic astronomical magnitude distribution:
      // Mostly faint microscopic pinpoints, few bright ones
      const randType = Math.random();
      let color;
      let size;

      if (randType < 0.35) {
        color = spectralColors[0];
        size = 0.8 + Math.random() * 0.8;
      } else if (randType < 0.75) {
        color = spectralColors[1];
        size = 0.9 + Math.random() * 0.7;
      } else if (randType < 0.90) {
        color = spectralColors[2];
        size = 1.1 + Math.random() * 0.9;
      } else if (randType < 0.97) {
        color = spectralColors[3];
        size = 1.4 + Math.random() * 1.2;
      } else {
        color = spectralColors[4];
        size = 1.5 + Math.random() * 1.3;
      }

      // Dim slightly if in upper right to protect title clarity
      if (x > 60 && y > 20) {
        size *= 0.75;
      }

      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
      starSizes[i] = size;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    // Custom point shader so each star has exact physical size attenuation and round sprite
    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // -------------------------------------------------------------
    // 3. JAMES WEBB SIGNATURE DIFFRACTION SPIKE STARS
    // -------------------------------------------------------------
    // Prominent foreground stars with realistic 6-point spikes.
    // CAREFULLY POSITIONED: Placed in celestial regions away from title.
    const spikeStarsGroup = new THREE.Group();
    const spikePositions = [
      { x: -170, y: 55, z: -40, scale: 22, color: 0x93c5fd },  // Left-mid blue supergiant
      { x: -110, y: -75, z: -30, scale: 26, color: 0xfef08a }, // Lower-left gold star near nebula
      { x: -210, y: 105, z: -60, scale: 19, color: 0xffffff }, // Upper-left white star
      { x: -25, y: -85, z: -35, scale: 17, color: 0xbae6fd },  // Bottom-center cyan star
      { x: -75, y: 90, z: -55, scale: 16, color: 0xfecdd3 },  // Upper-center muted rose star
      { x: -230, y: -35, z: -50, scale: 20, color: 0x7dd3fc }  // Far-left emission companion
    ];

    spikePositions.forEach((st) => {
      const mat = new THREE.SpriteMaterial({
        map: jwstSpikeSprite,
        color: new THREE.Color(st.color),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.92,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(st.x, st.y, st.z);
      sprite.scale.set(st.scale, st.scale, 1);
      spikeStarsGroup.add(sprite);
    });
    scene.add(spikeStarsGroup);

    // -------------------------------------------------------------
    // 4. DISTANT GALAXIES & LENSES (JWST Deep Field homage)
    // -------------------------------------------------------------
    const galaxyGroup = new THREE.Group();
    const galaxyPositions = [
      { x: -140, y: 110, z: -200, scale: 14, type: 'amber' },
      { x: -80, y: -110, z: -220, scale: 12, type: 'blue' },
      { x: 30, y: -130, z: -190, scale: 16, type: 'amber' },
      { x: -220, y: -80, z: -210, scale: 11, type: 'blue' }
    ];

    galaxyPositions.forEach((g) => {
      const mat = new THREE.SpriteMaterial({
        map: g.type === 'amber' ? galaxySpriteAmber : galaxySpriteBlue,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(g.x, g.y, g.z);
      sprite.scale.set(g.scale, g.scale, 1);
      galaxyGroup.add(sprite);
    });
    scene.add(galaxyGroup);

    // -------------------------------------------------------------
    // ANIMATION & PARALLAX LOOP
    // -------------------------------------------------------------
    let animationFrameId;
    const clock = new THREE.Clock();

    // Mouse coordinates for cinematic micro-parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 8;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 6;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera micro-parallax
      targetCameraX += (mouseX - targetCameraX) * 0.03;
      targetCameraY += (mouseY - targetCameraY) * 0.03;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;

      // Ultra-subtle, slow astronomical cosmic drift
      starField.rotation.y = elapsed * 0.0018;
      starField.rotation.x = elapsed * 0.0008;

      nebulaMesh.position.x = -45 + Math.sin(elapsed * 0.05) * 1.5;
      nebulaMesh.position.y = -30 + Math.cos(elapsed * 0.04) * 1.0;

      // Gentle twinkle on JWST foreground stars
      spikeStarsGroup.children.forEach((sprite, idx) => {
        const pulse = 1.0 + Math.sin(elapsed * 1.8 + idx * 1.5) * 0.06;
        const baseScale = spikePositions[idx].scale;
        sprite.scale.set(baseScale * pulse, baseScale * pulse, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      starGeo.dispose();
      starMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      starSprite.dispose();
      jwstSpikeSprite.dispose();
      galaxySpriteAmber.dispose();
      galaxySpriteBlue.dispose();
      if (carinaTexture) carinaTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
