import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="checkbox-wrapper">
        <label className="checkbox-label">
          <input
            ref={ref}
            type="checkbox"
            className={`checkbox ${className}`.trim()}
            {...props}
          />
          {label && <span>{label}</span>}
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

