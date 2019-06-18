import React from 'react'
import { Input } from 'antd'
import { ChangeLog } from '../interfaces/interfaces'

const Search = Input.Search;

export interface ChangeLogSearchProps {
  changeLogs: Array<ChangeLog>
  searchValue: string
  updateSearchValue(string): void
}

export interface ChangeLogSearchState {
}

class ChangeLogSearch extends React.Component<ChangeLogSearchProps, ChangeLogSearchState> {
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

export default ChangeLogSearch
