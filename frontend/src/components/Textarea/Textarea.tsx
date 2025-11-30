import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="textarea-wrapper">
        {label && <label htmlFor={props.id}>{label}</label>}
        <textarea
          ref={ref}
          className={`textarea ${error ? 'error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

