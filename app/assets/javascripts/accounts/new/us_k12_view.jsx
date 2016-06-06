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

  skipSelectSchool: function () {
    this.props.analytics.track('skip select school');
    this.props.goToProfile();
  },

  submitSchool: function(){
    var school;
    if (this.state.selectedSchool && this.state.selectedSchool.id) {
      school = this.state.selectedSchool.id;
    } else {
      school = 'not listed';
    }
    this.props.selectSchool(school);
  },

 showButton: function(){
   var content;
  if ($.isEmptyObject(this.state.selectedSchool)) {
    content = <span/>;
  } else {
    content = <button onClick={this.submitSchool} className='button-green select_school_button'>Confirm School</button>;
  }
  return content;
 },


  render: function() {
    return (
      <div className='row text-center'>
            <h3 className='sign-up-header col-xs-12'>{"Let's find your school"}</h3>
              <EC.SelectSchool selectedSchool={this.state.selectedSchool}
                               schoolOptions={this.state.schoolOptions}
                               requestSchools={this.requestSchools}
                               updateSchool={this.updateSchool}
                               isForSignUp={true}/>

          {this.showButton()}
          <div className='row'>
            <div className='col-xs-12 no-pl school_not_listed'><a onClick={this.submitSchool}> My school is not listed</a></div>
          </div>
      </div>
    );
  }
});
