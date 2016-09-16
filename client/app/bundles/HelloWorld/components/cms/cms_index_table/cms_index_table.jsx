import React from 'react'
import _ from 'underscore'
import CmsIndexTableRow from './cms_index_table_row.jsx'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  furnishRows: function () {
    var rows = _.map(this.props.data.resources, this.furnishRow, this);
    return rows;
  },

  furnishRow: function (resource) {
    return <CmsIndexTableRow
                  data={{resource: resource, identifier: this.props.data.identifier}}
                  key={resource.id}
                  actions={this.props.actions} />;
  },

  identifier: function () {
    return x = (this.props.data.identifier || 'Name')
  },

  render: function () {
    var rows = this.furnishRows()
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>{this.identifier()}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

});

*/
