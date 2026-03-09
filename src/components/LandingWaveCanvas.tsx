import { useEffect, useRef } from "react";
import * as THREE from "three";

const LandingWaveCanvas = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      1,
      2000
    );
    camera.position.set(0, 120, 260);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const particleCount = 5500;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const width = 1000;
    const depth = 1000;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = Math.random() * width - width / 2;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.random() * depth - depth / 2;

      scales[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#4f7cff") },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aScale;
        varying float vAlpha;

        void main() {
          vec3 pos = position;

          float wave1 = sin((pos.x * 0.016) + (uTime * 0.9)) * 18.0;
          float wave2 = cos((pos.z * 0.014) + (uTime * 0.7)) * 18.0;
          pos.y = wave1 + wave2;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          gl_PointSize = (3.2 + aScale * 2.8) * (280.0 / -mvPosition.z);
          vAlpha = 0.72 + aScale * 0.28;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        float strength = 1.0 - smoothstep(0.22, 0.5, dist);
        strength = pow(strength, 1.35);
        gl_FragColor = vec4(uColor, strength * vAlpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.35;
    points.rotation.z = -0.08;
    scene.add(points);

    const clock = new THREE.Clock();
    let animationId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      points.rotation.z = -0.08 + Math.sin(elapsed * 0.15) * 0.04;
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;

      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="landing-wave-canvas" />;
};

export default LandingWaveCanvas;