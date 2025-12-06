import './star-rating.css'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  readOnly?: boolean
  onChange?: (rating: number) => void
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 17,
  readOnly = true,
  onChange,
}: StarRatingProps) => {
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="star-rating">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isHalf = rating > index && rating < starValue
        const isFull = rating >= starValue

        return (
          <div
            key={index}
            className={`star ${isFull ? 'full' : isHalf ? 'half' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && onChange && onChange(starValue)}
          >
            {isFull ? (
              <svg viewBox="0 0 17 17" fill="none">
                <path
                  d="M8.5 0L10.4084 5.87336L16.584 5.87336L11.5878 9.50328L13.4962 15.3766L8.5 11.7467L3.50383 15.3766L5.41217 9.50328L0.416019 5.87336L6.59163 5.87336L8.5 0Z"
                  fill="#FF9500"
                />
              </svg>
            ) : isHalf ? (
              <svg viewBox="0 0 17 17" fill="none">
                <defs>
                  <linearGradient id={`half-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="50%" stopColor="#FF9500" />
                    <stop offset="50%" stopColor="#E5E5E5" />
                  </linearGradient>
                </defs>
                <path
                  d="M8.5 0L10.4084 5.87336L16.584 5.87336L11.5878 9.50328L13.4962 15.3766L8.5 11.7467L3.50383 15.3766L5.41217 9.50328L0.416019 5.87336L6.59163 5.87336L8.5 0Z"
                  fill={`url(#half-${index})`}
                />
              </svg>
            ) : (
              <svg viewBox="0 0 17 17" fill="none">
                <path
                  d="M8.5 0L10.4084 5.87336L16.584 5.87336L11.5878 9.50328L13.4962 15.3766L8.5 11.7467L3.50383 15.3766L5.41217 9.50328L0.416019 5.87336L6.59163 5.87336L8.5 0Z"
                  fill="#E5E5E5"
                  stroke="#E5E5E5"
                  strokeWidth="0.5"
                />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

