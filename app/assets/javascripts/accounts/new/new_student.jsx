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
      label: 'Email (optional)'
    },
    {
      name: 'password'
    }
  ],

  render: function () {
    var inputs;
    inputs = _.map(this.formFields, function (ele) {
      return <EC.TextInput key={ele.name} update={this.props.update} name={ele.name} label={ele.label} errors={this.props.errors[ele.name]}/>;
    }, this);
    return (
      <span>
        {inputs}
        <div>By signing up, you agree to our <a href='/tos'>terms of service</a> and <a href='/privacy'>privacy policy</a>.</div>
        <button id='sign_up' className='button-green' onClick={this.props.signUp}>Sign Up</button>
      </span>
    );
  }
});
