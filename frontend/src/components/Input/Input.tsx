import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label htmlFor={props.id}>{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

