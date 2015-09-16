'use strict';
EC.NewTeacher = React.createClass({
  propTypes: {
    analytics: React.PropTypes.object.isRequired,
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    stage: React.PropTypes.number.isRequired,
    update: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      selectedSchool: {},
      schoolOptions: [],
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
    this.props.analytics.track('select school');
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
    this.props.analytics.track('skip select school');
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
    this.props.update({sendNewsletter: val});
  },

  render: function () {
    if (this.props.stage ===1) {
      var inputs;
      inputs = _.map(this.formFields, function (ele) {
        return <EC.TextInput key={ele.name}
                             update={this.props.update}
                             name={ele.name}
                             label={ele.label}
                             errors={this.props.errors[ele.name]}/>;
      }, this);
      return (
        <div className='row'>
          <div className='col-xs-offset-3 col-xs-9'>
            <div className='row'>
              <div className='col-xs-8'>
                <h3 className='sign-up-header'>Sign up for a Teacher Account</h3>
              </div>
            </div>
            <EC.AuthSignUp />
            <div className='row'>
              <div className='col-xs-12'>
                {inputs}
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-8'>
                <input type='checkbox'
                       name='sendNewsletter'
                       ref='sendNewsletter'
                       onChange={this.updateSendNewsletter}
                       checked={this.props.sendNewsletter}>
                    Send me monthly Quill updates
                  </input>
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
    } else if (this.props.stage ===2) {
      return (
        <div className='row'>
          <div className='col-xs-offset-3 col-xs-6'>
            <div className='row'>
              <h3 className='sign-up-header col-xs-12'>{"Let's find your school"}</h3>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <EC.SelectSchool selectedSchool={this.state.selectedSchool}
                                 schoolOptions={this.state.schoolOptions}
                                 requestSchools={this.requestSchools}
                                 updateSchool={this.updateSchool}
                                 isForSignUp={true}/>
              </div>
            </div>
            <div className='row'>
              <button onClick={this.selectSchool} className='button-green col-xs-12 select_school_button'>Select your school</button>
            </div>
            <div className='row'>
              <div className='col-xs-12 no-pl school_not_listed'>My school is not listed, or I do not teach in the United States</div>
            </div>
            <div className='row'>
              <button onClick={this.skipSelectSchool} className='button-green col-xs-12'>Skip</button>
            </div>
          </div>
        </div>
      );
    }
  }
});
