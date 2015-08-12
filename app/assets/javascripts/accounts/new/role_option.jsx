'use strict';
EC.RoleOption = React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },
  selectRole: function () {
    this.props.selectRole(this.props.role);
  },
  render: function () {
    return (
      <button className={'select_' + this.props.role + ' button-green'} onClick={this.selectRole}>
        {this.props.role[0].toUpperCase() + this.props.role.substring(1)}
      </button>
    );
  }
});