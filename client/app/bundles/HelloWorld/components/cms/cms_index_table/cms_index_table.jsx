import React from 'react'
import _ from 'underscore'
import SortableList from '../../../components/shared/sortableList'
import CmsIndexTableRow from './cms_index_table_row.jsx'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  furnishRows: function () {
    var rows = this.props.data.resources.map((resource, index) => this.furnishRow(resource, index) );
    return rows;
  },

  furnishRow: function (resource, index) {
    return <CmsIndexTableRow
                  data={{resource: resource, identifier: this.props.data.identifier}}
                  key={index}
                  actions={this.props.actions}
                  resourceNameSingular={this.props.resourceNameSingular}
                />;
  },

  identifier: function () {
    return this.props.data.identifier || 'Name'
  },

  renderRows: function () {
    if(this.props.isSortable) {
      return <div className="sortable-table">
        <div className="header"><span>Name</span><span>Actions</span></div>
        <SortableList data={this.furnishRows()} sortCallback={this.props.updateOrder} />
      </div>
    } else {
      return (<table className='table'>
        <thead>
          <tr>
            <th>{this.identifier()}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.furnishRows()}
        </tbody>
      </table>)
    }
  },

  render: function () {
    return this.renderRows();
  }

});
