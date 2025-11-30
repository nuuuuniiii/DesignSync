import { useState } from 'react'

interface RatingSliderProps {
  min?: number
  max?: number
  value?: number
  onChange?: (value: number) => void
  label?: string
  readOnly?: boolean
}

export const RatingSlider = ({
  min = 1,
  max = 5,
  value: controlledValue,
  onChange,
  label,
  readOnly = false,
}: RatingSliderProps) => {
  const [internalValue, setInternalValue] = useState(1)
  const value = controlledValue ?? internalValue

  const handleChange = (newValue: number) => {
    if (readOnly) return
    if (!controlledValue) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <div className="rating-slider">
      {label && <label>{label}</label>}
      <div className="rating-display">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <span key={star} className={star <= value ? 'filled' : ''}>
            ⭐
          </span>
        ))}
        <span className="rating-number">{value}</span>
      </div>
      {!readOnly && (
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="slider"
        />
      )}
    </div>
  )
}

