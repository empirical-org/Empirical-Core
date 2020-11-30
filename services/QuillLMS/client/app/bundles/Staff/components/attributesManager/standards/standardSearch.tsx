import React from 'react'
import { Input } from 'antd'

const Search = Input.Search;

const StandardSearch = ({ updateSearchValue, }) => (<div className="certain-category-search-wrapper">
  <Search
    onSearch={updateSearchValue}
    placeholder="Search by standard name"
    prefix={<i className="fas fa-search" style={{color: '#d9d9d9'}} />}
    style={{ width: '100%' }}
  />
</div>)

export default StandardSearch
