import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  helperText,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || false)

  const handleFocus = () => setFocused(true)
  const handleBlur = (e) => {
    setFocused(false)
    setHasValue(e.target.value !== '')
  }

  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-transparent
    focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200
    ${error 
      ? 'border-error focus:border-error focus:ring-error' 
      : 'border-gray-300 focus:border-secondary focus:ring-secondary'
    }
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Icon */}
      {icon && (
        <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
          <ApperIcon 
            name={icon} 
            className={`w-5 h-5 ${error ? 'text-error' : 'text-gray-400'}`} 
          />
        </div>
      )}

      {/* Input */}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => {
          setHasValue(e.target.value !== '')
          props.onChange?.(e)
        }}
        placeholder={label || props.placeholder}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            scale: focused || hasValue || props.value ? 0.75 : 1,
            y: focused || hasValue || props.value ? -20 : 0,
            x: focused || hasValue || props.value ? -12 : 0
          }}
          transition={{ duration: 0.2 }}
          className={`absolute left-3 top-2 origin-left pointer-events-none transition-colors duration-200 ${
            focused 
              ? (error ? 'text-error' : 'text-secondary')
              : 'text-gray-500'
          } ${icon && iconPosition === 'left' ? 'left-10' : ''}`}
        >
          {label}
        </motion.label>
      )}

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-1 text-sm ${error ? 'text-error' : 'text-gray-500'}`}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input