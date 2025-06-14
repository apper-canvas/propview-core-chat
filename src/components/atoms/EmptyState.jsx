import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from './Button'

export default function EmptyState({
  icon = 'Home',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}