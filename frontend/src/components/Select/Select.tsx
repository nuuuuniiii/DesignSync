import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="select-wrapper">
        {label && <label htmlFor={props.id}>{label}</label>}
        <select
          ref={ref}
          className={`select ${error ? 'error' : ''} ${className}`.trim()}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="error-message">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'

