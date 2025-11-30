/**
 * Category 컴포넌트
 * 
 * Figma 디자인: https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=14-4969&m=dev
 */

interface CategoryProps {
  categories: string[]
  selectedCategory?: string
  onCategorySelect?: (category: string | undefined) => void
}

export const Category = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryProps) => {
  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(selectedCategory === category ? undefined : category)
    }
  }

  // 카테고리를 3개의 컬럼으로 나누기
  const column1 = categories.slice(0, 5) // E-Commerce, Media, Social, Entertainment, Education
  const column2 = categories.slice(5, 10) // Business, Finance, Government, Wellness, Travel
  const column3 = categories.slice(10) // Lifestyle, Technology

  return (
    <div className="category-container">
      <h2 className="category-title">Categories</h2>
      <div className="category-columns">
        <div className="category-column">
          {column1.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`category-item ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="category-column">
          {column2.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`category-item ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="category-column">
          {column3.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`category-item ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

