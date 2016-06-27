EC.NewAccountStage1 = React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },

  render: function () {
    var roleOptions = _.map(['educator', 'student'], function (role) {
      return (
          <EC.RoleOption selectRole={this.props.selectRole} role={role} />
      );
    }, this);

    return (
        <div className='row sign_up_select_role'>
            <div className='row'>
              <h3 className='col-xs-12'>
                Sign up for Quill as:
              </h3>
            </div>
            <div className='option-wrapper'>
              {roleOptions}
            </div>
            <div className='row'>
              <div className='col-xs-12'>Already signed up? <a href='/session/new'>Return to Login</a></div>
            </div>
        </div>
      );
  }
});
