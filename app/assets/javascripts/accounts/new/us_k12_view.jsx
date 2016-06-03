'use strict'

EC.UsK12View = React.createClass({

  getInitialState: function () {
    this.props.analytics.track('for google analytics teacher signed up');
    return {
      selectedSchool: {},
      schoolOptions: []
    };
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

  goToProfile: function () {
    window.location = '/profile';
  },

  skipSelectSchool: function () {
    this.props.analytics.track('skip select school');
    this.goToProfile();
  },

  render: function() {
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
});
