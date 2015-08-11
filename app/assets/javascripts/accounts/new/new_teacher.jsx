EC.NewTeacher = React.createClass({
  propTypes: {
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    stage: React.PropTypes.number.isRequired,
    updateSendNewsletter: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      selectedSchool: {},
      schoolOptions: []
    }
  },

  requestSchools: function (zip) {
    $.ajax({
      url: '/schools.json',
      data: {zipcode: zip},
      success: this.populateSchools
    });
  },

  populateSchools: function (data) {
    this.setState({schoolOptions: data});
  },

  updateSchool: function (school) {
    this.setState({selectedSchool: school});
  },

  selectSchool: function () {
    $.ajax({
      type: 'PUT',
      url: '/select_school',
      data: {
        school_id: this.state.selectedSchool.id
      },
      success: this.goToProfile
    });
  },

  skipSelectSchool: function () {
    this.goToProfile()
  },

  goToProfile: function () {
    window.location = '/profile';
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
      name: 'email'
    },
    {
      name: 'password'
    }
  ],

  updateSendNewsletter: function () {
    var val = $(this.refs.sendNewsletter.getDOMNode()).attr('checked');
    this.props.updateSendNewsletter(val);
  },

  render: function () {
    if (this.props.stage ===1) {
      var inputs;
      inputs = _.map(this.formFields, function (ele) {
        return <EC.TextInput key={ele.name} update={this.props.update} name={ele.name} label={ele.label} errors={this.props.errors[ele.name]}/>;
      }, this);
      return (
        <div className='row'>
          <div className='row'>
            <h3>Sign up for a teacher account</h3>
          </div>
          <div className='row'>
            <div className='col-xs-offset-3 col-xs-9'>
              {inputs}
              <input type='checkbox' ref='sendNewsletter' onChange={this.updateSendNewsletter} checked={this.props.sendNewsletter}>Send me monthly Quill updates</input>
              <div>By signing up, you agree to our <a href='/tos'>terms of service</a> and <a href='/privacy'>privacy policy</a>.</div>
              <button id='sign_up' className='button-green col-xs-8' onClick={this.props.signUp}>Sign Up</button>
            </div>
          </div>
        </div>
      );
    } else if (this.props.stage ===2) {
      return (
        <span>
          <h3>{"Let's find your school"}</h3>
          <EC.SelectSchool selectedSchool={this.state.selectedSchool}
                           schoolOptions={this.state.schoolOptions}
                           requestSchools={this.requestSchools}
                           updateSchool={this.updateSchool} />

          <div onClick={this.selectSchool} className='button-green'>Select your school</div>
          <div>My school is not listed, or I do not teach in the United States</div>
          <div onClick={this.skipSelectSchool} className='button-grey'>Skip</div>
        </span>
      );
    }
  }
});