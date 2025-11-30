import { InputHTMLAttributes, forwardRef } from 'react'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="radio-wrapper">
        <label className="radio-label">
          <input
            ref={ref}
            type="radio"
            className={`radio ${className}`.trim()}
            {...props}
          />
          <span>{label}</span>
        </label>
      </div>
    )
  }
)

Radio.displayName = 'Radio'

