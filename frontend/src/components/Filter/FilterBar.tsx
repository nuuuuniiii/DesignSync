interface FilterBarProps {
  categories: string[]
  selectedCategory?: string
  selectedStatus?: 'solved' | 'unsolved' | 'all'
  onCategoryChange?: (category: string) => void
  onStatusChange?: (status: 'solved' | 'unsolved' | 'all') => void
}

export const FilterBar = ({
  categories,
  selectedCategory,
  selectedStatus = 'all',
  onCategoryChange,
  onStatusChange,
}: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange?.(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="status-filters">
        <button
          onClick={() => onStatusChange?.('unsolved')}
          className={selectedStatus === 'unsolved' ? 'active' : ''}
        >
          Unsolved
        </button>
        <button
          onClick={() => onStatusChange?.('solved')}
          className={selectedStatus === 'solved' ? 'active' : ''}
        >
          Solved
        </button>
      </div>
    </div>
  )
}

