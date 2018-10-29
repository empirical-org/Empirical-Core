'use strict'
import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';

class SelectNonUSK12 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSchool: {},
    }
    this.HIGHER_EDUCATION = 'us higher ed';
    this.HOME_SCHOOL = 'home school';
    this.INTERNATIONAL = 'international';
    this.OTHER = 'other';
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

  submitSchool() {
    let school;
    if (this.state.selectedSchool && this.state.selectedSchool.id) {
      school = this.state.selectedSchool.id;
    } else {
      school = this.UNLISTED_SCHOOL;
    }
    this.selectSchool(school);
  }

  render(){
      return (
        <div className='educator-type'>
          <h3>Which type of Educator are you?</h3>
           <div className='option-wrapper non-us'>
             <button className='button-green' onClick={() => this.selectSchool(this.HOME_SCHOOL)}>Home School</button>
             <button className='button-green' onClick={() => this.selectSchool(this.HIGHER_EDUCATION)}>U.S Higher Ed</button>
             <button className='button-green' onClick={() => this.selectSchool(this.INTERNATIONAL)}>International</button>
             <button className='button-green' onClick={() => this.selectSchool(this.OTHER)}>Other</button>
           </div>
        </div>
      );
    }
}

export default SelectNonUSK12
