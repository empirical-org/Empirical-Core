import React from 'react'

export interface SearchProps {
  searchValue: string
  updateSearchValue(string): void
  placeholder: string
}

const Search = ({ updateSearchValue, searchValue, placeholder, }) => (
  <div className="certain-category-search-wrapper">
    <i className="fas fa-search" style={{color: '#d9d9d9'}} />
    <input
      aria-label="Search field"
      onChange={updateSearchValue}
      placeholder={placeholder}
      value={searchValue}
    />
  </div>
)

export default Search
