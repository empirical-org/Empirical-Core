'use strict';
EC.NewStudent = React.createClass({
  propTypes: {
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    textInputGenerator: React.PropTypes.object.isRequired
  },

  formFields: [
    {
      name: 'first_name',
      label: 'First Name',
      errorLabel: 'Name'
    },
    {
      name: 'last_name',
      label: 'Last Name',
      errorLabel: 'Name'
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
    var inputs;
    inputs = this.props.textInputGenerator.generate(this.formFields);
    return (
      <div>
      <div className='row'>
        <div className='col-xs-offset-3 col-xs-9'>
          <div className='row'>
            <div className='col-xs-8'>
              <h3 className='sign-up-header'>Sign up for a Student Account</h3>
            </div>
          </div>
          <EC.AuthSignUp />
          </div>
            <p className='text-center support-p'>We now support Google Classroom!</p>
          </div>
          <div className='row'>
            <div className='col-xs-offset-3 col-xs-9'>
          <div className='col-xs-8 need-a-border'/>
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
    </div>
    );
  }
});
