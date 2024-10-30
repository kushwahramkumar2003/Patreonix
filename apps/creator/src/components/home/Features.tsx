// components/Features.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, Users, Coins } from 'lucide-react'

const features = [
  {
    icon: <Zap className="h-8 w-8 text-indigo-400" />,
    title: 'Powerful Tools',
    description: 'Access a suite of tools designed to help you create, manage, and grow your content.',
  },
  {
    icon: <Shield className="h-8 w-8 text-green-400" />,
    title: 'Secure Platform',
    description: 'Your content and earnings are protected with state-of-the-art security measures.',
  },
  {
    icon: <Users className="h-8 w-8 text-blue-400" />,
    title: 'Community Building',
    description: 'Foster a loyal community around your content with our engagement features.',
  },
  {
    icon: <Coins className="h-8 w-8 text-yellow-400" />,
    title: 'Flexible Monetization',
    description: 'Choose from various monetization options to suit your content and audience.',
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
            Unleash Your Creative Potential
          </h2>
          <p className="mt-4 text-xl text-zinc-300">
            Patreonix provides everything you need to succeed as a creator.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center bg-zinc-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-zinc-700">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-zinc-100">{feature.title}</h3>
                <p className="mt-2 text-zinc-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features