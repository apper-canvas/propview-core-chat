import { motion } from 'framer-motion'

export default function Card({ 
  children, 
  hover = true,
  className = '',
  ...props 
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`bg-surface rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}