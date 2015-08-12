EC.NewAccountStage1 = React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },

  render: function () {
    var roleOptions = _.map(['teacher', 'student'], function (role) {
      return (
        <div className='col-xs-6'>
          <EC.RoleOption key={role} selectRole={this.props.selectRole} role={role} />
        </div>
      );
    }, this);

    return (
        <div className='row sign_up_select_role'>
          <div className='col-xs-4 col-xs-offset-4'>
            <div className='row'>
              <h3 className='col-xs-12'>
                Sign up for Quill as:
              </h3>
            </div>
            <div className='row'>
              {roleOptions}
            </div>
            <div className='row'>
              <div className='col-xs-12'>Already signed up? Return to <a href='/session/new'>Login</a></div>
            </div>
          </div>
        </div>
      );
  }
});
