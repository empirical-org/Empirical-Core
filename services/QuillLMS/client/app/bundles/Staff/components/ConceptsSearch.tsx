import React from 'react'
import { Input } from 'antd'

import { Concept } from '../interfaces/interfaces'

const Search = Input.Search;

export interface ConceptSearchProps {
  concepts: Array<Concept>
  searchValue: string
  updateSearchValue(string): void
}

export interface ConceptSearchState {
}

class ConceptSearch extends React.Component<ConceptSearchProps, ConceptSearchState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="certain-category-search-wrapper">
        <Search
          onSearch={this.props.updateSearchValue}
          placeholder="Search by concept name or UID"
          prefix={<i className="fas fa-search" style={{color: '#d9d9d9'}} />}
          style={{ width: '100%' }}
        />
      </div>
    )
  }

}

export default ConceptSearch
