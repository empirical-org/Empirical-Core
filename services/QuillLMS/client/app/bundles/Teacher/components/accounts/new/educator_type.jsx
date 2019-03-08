'use strict'
import React from 'react'
import $ from 'jquery'
import SchoolSelector from '../../shared/school_selector'
import NotUsK12View from '../school/not_us_k12_view'
import ScrollToTop from '../../shared/scroll_to_top'
export default React.createClass({

  getInitialState: function() {
    return ({stage: 1});
  },

  goToStage:function(num){
    this.setState({stage: num});
  },

  finish: function () {
    if (this.props.teacherFromGoogleSignUp) {
      window.location = '/teachers/classrooms/google_sync'
    } else if (this.props.modal) {
      // refresh teacher account page;
      window.location = '/teachers/my_account';
    } else {
      window.location = '/profile';
    }
  },


  selectSchool: function (school_id_or_type) {
    if (this.props.analytics) {
      this.props.analytics.track('select school');
      $.ajax({
        type: 'PUT',
        dataType: "json",
        url: '/select_school',
        data: {
          school_id_or_type: school_id_or_type
        },
        success: this.finish
      });
    }
  },




  stateSpecificComponents: function(){
    if (this.state.stage === 1) {
      return (
        <div className='educator-type'>
          <ScrollToTop />
          <h3>Are you a faculty member at a U.S. K-12 school?*</h3>
           <div className='option-wrapper'>
             <button className='button contained primary large' onClick={() => this.goToStage(2)}>Yes</button>
             <button className='button contained primary large' onClick={() => this.goToStage(3)}>No</button>
           </div>
           <div className="explanation">
             *K-12 is a term for school grades prior to college.<br/>
             These grades span from kindergarten through the 12th grade.
           </div>
        </div>
      );
    } else if (this.state.stage === 2) {
      return (
        <div className='educator-type'>
          <SchoolSelector selectSchool={this.selectSchool} />
        </div>
      );
    } else if (this.state.stage === 3) {
      return (
        <div className='educator-type'>
          <NotUsK12View analytics={this.props.analytics} selectSchool={this.selectSchool}/>
        </div>
      )
    }
  },

  render: function(){
    return(this.stateSpecificComponents());
  }
});
