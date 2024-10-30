// components/Hero.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import Button from '@repo/ui/components/ui/Button'

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.z = 5

    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
    const material = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    const animate = () => {
      requestAnimationFrame(animate)
      torus.rotation.x += 0.01
      torus.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text"
        >
          Empower Your Creativity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-zinc-300"
        >
          Connect with your audience, monetize your content, and build a thriving community on Patreonix.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex justify-center space-x-4"
        >
          <Button variant="cta" size="lg">Start Creating</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero