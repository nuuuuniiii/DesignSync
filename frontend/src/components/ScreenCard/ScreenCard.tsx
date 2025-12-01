import './screen-card.css'

interface ScreenCardProps {
  screenNumber: number
  imageUrl?: string
  onClick?: () => void
}

export const ScreenCard = ({ screenNumber, imageUrl, onClick }: ScreenCardProps) => {
  return (
    <div className="screen-card" onClick={onClick}>
      {imageUrl ? (
        <img src={imageUrl} alt={`Screen ${screenNumber}`} className="screen-image" />
      ) : (
        <div className="screen-placeholder" />
      )}
      <div className="screen-number-badge">
        <span>{screenNumber}</span>
      </div>
    </div>
  )
}

