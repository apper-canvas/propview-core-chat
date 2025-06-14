import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm',
    secondary: 'border border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-sm',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-primary',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`

  const iconClass = iconSizes[size]

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" className={`${iconClass} animate-spin`} />
    }
    if (icon) {
      return <ApperIcon name={icon} className={iconClass} />
    }
    return null
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon()}
        </span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon()}
        </span>
      )}
    </motion.button>
  )
}