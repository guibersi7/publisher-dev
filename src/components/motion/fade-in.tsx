'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className,
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

