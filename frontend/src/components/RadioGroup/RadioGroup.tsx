import { Radio } from '../Radio/Radio'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
}

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  label,
}: RadioGroupProps) => {
  return (
    <div className="radio-group">
      {label && <label className="radio-group-label">{label}</label>}
      <div className="radio-group-options">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}

