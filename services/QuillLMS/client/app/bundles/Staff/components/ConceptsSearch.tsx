import React, {Component} from 'react'
import {Input} from 'antd'
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
          placeholder="Search for a concept"
          onSearch={this.props.updateSearchValue}
          style={{ width: 300 }}
          enterButton
        />
      </div>
    )
  }
  
}

export default ConceptSearch