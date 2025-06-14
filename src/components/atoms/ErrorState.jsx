import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from './Button'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data.',
  onRetry,
  className = ''
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <div className="mb-6">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button variant="primary" onClick={onRetry} icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  )
}