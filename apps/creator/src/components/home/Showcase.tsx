// components/Showcase.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const Showcase = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      wireframe: true,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    const animate = () => {
      requestAnimationFrame(animate);
      icosahedron.rotation.x += 0.005;
      icosahedron.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="showcase"
      className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-800 relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-zinc-100 sm:text-4xl"
          >
            Showcase Your Creativity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-zinc-300"
          >
            Join a community of creators and share your passion with the world.
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              className="bg-zinc-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-40 bg-zinc-700 rounded-md mb-4"></div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Creator Spotlight {item}
              </h3>
              <p className="mt-2 text-zinc-300">
                Discover amazing content from our featured creators.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
