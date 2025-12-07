interface ProfileIconProps {
  className?: string
  width?: number
  height?: number
}

/**
 * 프로필 아이콘 컴포넌트
 */
export const ProfileIcon = ({
  className = '',
  width = 40,
  height = 40,
}: ProfileIconProps) => {
  return (
    <div className={`profile-icon-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="22" cy="22" r="19" fill="#ffffff" stroke="#000000" strokeWidth="2" />
        <circle cx="22" cy="17" r="4.5" fill="none" stroke="#000000" strokeWidth="2" />
        <path
          d="M12 34C12 29.5 16.477 25.5 22 25.5C27.523 25.5 32 29.5 32 34"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

