import React from 'react'
import _ from 'underscore'

import CmsIndexTableRow from './cms_index_table_row.jsx'

import { SortableList, } from '../../../../Shared/index'

export default class CmsIndexTable extends React.Component {
  furnishRows = () => {
    let rows = this.props.data.resources.map((resource, index) => this.furnishRow(resource, index) );
    return rows;
  };

  furnishRow = (resource, index) => {
    return (
      <CmsIndexTableRow
        actions={this.props.actions}
        data={{resource: resource, identifier: this.props.data.identifier}}
        key={index}
        resourceNameSingular={this.props.resourceNameSingular}
      />
    );
  };

  identifier = () => {
    return this.props.data.identifier || 'Name'
  };

  renderRows = () => {
    if(this.props.isSortable) {
      return (
        <div className="sortable-table">
          <div className="header"><span>Name</span><span>Actions</span></div>
          <SortableList data={this.furnishRows()} sortCallback={this.props.updateOrder} />
        </div>
      )
    } else {
      return (
        <table className='table'>
          <thead>
            <tr>
              <th>{this.identifier()}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.furnishRows()}
          </tbody>
        </table>
      )
    }
  };

  render() {
    return this.renderRows();
  }
}
