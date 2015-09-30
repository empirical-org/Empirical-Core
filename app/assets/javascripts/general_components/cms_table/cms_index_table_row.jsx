EC.CmsIndexTableRow = React.createClass({
  propTypes: {
    resource: React.PropTypes.object.isRequired,
    edit: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired
  },

  edit: function () {
    this.props.edit(this.props.resource);
  },

  delete: function () {
    var x = confirm('are you sure you want to delete ' + this.props.resource.name + '?');
    if (x) {
      this.props.delete(this.props.resource);
    }
  },

  render: function () {
    return (
      <tr>
        <td>
          {this.props.resource.name}
        </td>
        <td>
          <div className='row'>
            <div className='col-xs-6' onClick={this.edit}>
              edit
            </div>
            <div className='col-xs-6' onClick={this.delete}>
              delete
            </div>
          </div>
        </td>
      </tr>
    );
  }
})