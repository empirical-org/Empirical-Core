import React, {Component} from 'react'
import { Input, Icon } from 'antd'
import { Concept } from '../containers/ConceptsEdit';

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
          placeholder="Search by concept name or UID"
          onSearch={this.props.updateSearchValue}
          style={{ width: '100%' }}
          prefix={<i className="fas fa-search" style={{color: '#d9d9d9'}}></i>}
        />
      </div>
    )
  }

}

export default ConceptSearch
