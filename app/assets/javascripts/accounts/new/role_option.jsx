EC.RoleOption = React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },
  selectRole: function () {
    this.props.selectRole(this.props.role);
  },
  render: function () {
    return (
      <span onClick={this.selectRole}>
        {this.props.role}
      </span>
    );
  }
});