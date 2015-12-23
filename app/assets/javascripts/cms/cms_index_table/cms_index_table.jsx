EC.CmsIndexTable = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  furnishRows: function () {
    var rows = _.map(this.props.data.resources, this.furnishRow, this);
    return rows;
  },

  furnishRow: function (resource) {
    return <EC.CmsIndexTableRow
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

/*
container progress-report

  progress-reports-standards-classrooms

    <table className='table'>
      <thead>
        <tr>
          <th>
          <th>
          ...
        </tr>
      </thead>
      <tbody>
        <tr>
        <tr>
        ...
      </tbody>
    </table>

*/