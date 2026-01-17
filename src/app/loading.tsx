'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-16 h-16 bg-orange-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-orange-accent" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-warm-gray"
        >
          Carregando...
        </motion.p>
      </motion.div>
    </div>
  )
}

