import { useState } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export const SearchBar = ({ placeholder = 'Search sites', onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  )
}

