'use strict'
import $ from 'jquery'
import SelectSchool from './select_us_k12_helper'
import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';

class SelectUSK12 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSchool: {},
      schoolOptions: []
    }
    this.UNLISTED_SCHOOL = 'not listed';

    this.requestSchools = this.requestSchools.bind(this);
    this.populateSchools = this.populateSchools.bind(this);
    this.updateSchool = this.updateSchool.bind(this);
    this.skipSelectSchool = this.skipSelectSchool.bind(this);
    this.submitSchool = this.submitSchool.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
    this.submitUnlisted = this.submitUnlisted.bind(this);

  }

  uponSelectSchool() {
    window.location = '/teachers/classrooms/new'
  }
  selectSchoolError() {
    alert('There was an error, if this problem persists, please let us know.');
  }

  selectSchool(school_id_or_type) {
    $.ajax({
      type: 'PUT',
      dataType: "json",
      url: '/select_school',
      data: {
        school_id_or_type: school_id_or_type
      },
      success: this.uponSelectSchool,
      error: this.selectSchoolError
    });
  }

  requestSchools(zip) {
    $.ajax({
      url: '/schools.json',
      data: {zipcode: zip},
      success: this.populateSchools
    });
  }

  populateSchools(data) {
    this.setState({schoolOptions: data});
  }

  updateSchool(school) {
    this.setState({selectedSchool: school});
  }

  skipSelectSchool() {
    this.props.analytics.track('skip select school');
    this.props.finish();
  }
  
  submitSchool() {
    let school;
    if (this.state.selectedSchool && this.state.selectedSchool.id) {
      school = this.state.selectedSchool.id;
    } else {
      school = this.UNLISTED_SCHOOL;
    }
    this.selectSchool(school);
  }

  submitUnlisted() {
    this.selectSchool(this.UNLISTED_SCHOOL);
  }
  
  showButton() {
    let content;
    if ($.isEmptyObject(this.state.selectedSchool)) {
      content = <span/>;
    } else {
      content = <button onClick={this.submitSchool} className='button-green select_school_button'>Confirm School</button>;
    }
    return content;
  }

  render() {
    return (
      <div className='row text-center'>
            <h3 className='sign-up-header col-xs-12'>{"Let's find your school"}</h3>
              <SelectSchool selectedSchool={this.state.selectedSchool}
                               schoolOptions={this.state.schoolOptions}
                               requestSchools={this.requestSchools}
                               updateSchool={this.updateSchool}
                               isForSignUp={true}/>
          {this.showButton()}
          <div className='row'>
            <div className='col-xs-12 no-pl school_not_listed'><a id='school_not_listed' onClick={this.submitUnlisted}>My school is not listed</a></div>
          </div>
      </div>
    );
  }
}

export default SelectUSK12
