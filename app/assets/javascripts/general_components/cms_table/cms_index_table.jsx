EC.CmsIndexTable = React.createClass({
  propTypes: {
    resources: React.PropTypes.array.isRequired,
    edit: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired
  },

  furnishRows: function () {
    var rows = _.map(this.props.resources, this.furnishRow, this);
    return rows;
  },

  furnishRow: function (resource) {
    return <EC.CmsIndexTableRow
                  resource={resource}
                  key={resource.id}
                  edit={this.props.edit}
                  delete={this.props.delete} />;
  },

  render: function () {
    var rows = this.furnishRows()
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
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