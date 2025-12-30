import { forwardRef } from 'react'
import useHapticFeedback from '../../hooks/useHapticFeedback'
import './TouchTarget.css'

const TouchTarget = forwardRef(({ 
  children, 
  onClick, 
  className = '', 
  size = 'default',
  haptic = 'light',
  feedback = true,
  disabled = false,
  as = 'button',
  ...props 
}, ref) => {
  const { light, medium, heavy, selection } = useHapticFeedback()
  
  const handleClick = (e) => {
    if (disabled) return
    
    // Trigger haptic feedback
    if (haptic && !disabled) {
      switch (haptic) {
        case 'light':
          light()
          break
        case 'medium':
          medium()
          break
        case 'heavy':
          heavy()
          break
        case 'selection':
          selection()
          break
        default:
          light()
      }
    }
    
    onClick?.(e)
  }

  const Component = as
  const classes = [
    'touch-target',
    size !== 'default' && size,
    feedback && 'touch-feedback',
    disabled && 'disabled',
    className
  ].filter(Boolean).join(' ')

  return (
    <Component
      ref={ref}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  )
})

TouchTarget.displayName = 'TouchTarget'

export default TouchTarget