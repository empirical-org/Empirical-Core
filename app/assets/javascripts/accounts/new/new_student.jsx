'use strict';
EC.NewStudent = React.createClass({
  propTypes: {
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  },

  formFields: [
    {
      name: 'first_name',
      label: 'First Name'
    },
    {
      name: 'last_name',
      label: 'Last Name'
    },
    {
      name: 'username'
    },
    {
      name: 'email',
      label: 'Email (optional)',
      errorLabel: 'Email'
    },
    {
      name: 'password'
    }
  ],

  render: function () {
    var inputs = _.map(this.formFields, function (ele) {
      return <EC.TextInput key={ele.name}
                           update={this.props.update}
                           name={ele.name}
                           label={ele.label}
                           errorLabel={ele.errorLabel}
                           errors={this.props.errors[ele.name]}/>;
    }, this);
    return (
      <div className='row'>
        <div className='col-xs-offset-3 col-xs-9'>
          <div className='row'>
            <div className='col-xs-8'>
              <h3 className='sign-up-header'>Sign up for a Student Account</h3>
            </div>
          </div>
          <EC.AuthSignUp />
          <div className='row'>
            <div className='col-xs-12'>
              {inputs}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <button id='sign_up' className='button-green col-xs-8' onClick={this.props.signUp}>Sign Up</button>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-8'>
              <div className='text-align-center'>By signing up, you agree to our <a href='/tos'>terms of service</a> and <a href='/privacy'>privacy policy</a>.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
