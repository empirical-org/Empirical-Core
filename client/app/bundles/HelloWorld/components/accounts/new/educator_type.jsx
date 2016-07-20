'use strict'
import React from 'react'
import $ from 'jquery'
import UsK12View from '../school/us_k12_view'
import NotUsK12View from '../school/not_us_k12_view'
export default React.createClass({

  getInitialState: function() {
    return ({stage: 1});
  },

  goToStage:function(num){
    this.setState({stage: num});
  },

  finish: function () {
    if (this.props.modal) {
      // refresh teacher account page;
      window.location = '/teachers/my_account';
    } else {
      window.location = '/profile';
    }
  },


  selectSchool: function (school_id_or_type) {
    this.props.analytics.track('select school');
    $.ajax({
      type: 'PUT',
      url: '/select_school',
      data: {
        school_id_or_type: school_id_or_type
      },
      success: this.finish
    });
  },




  stateSpecificComponents: function(){
    if (this.state.stage === 1) {
      return (
        <div className='educator-type'>
          <h3>Are you a faculty member at a U.S K-12 School?*</h3>
           <div className='option-wrapper'>
             <button className='button-green' onClick={() => this.goToStage(2)}>Yes</button>
             <button className='button-green' onClick={() => this.goToStage(3)}>No</button>
           </div>
           <div>
             *K-12 is a term for school grades prior to college.<br/>
             These grades span from kindergarten through the 12th grade.
           </div>
        </div>
      );
    } else if (this.state.stage === 2) {
      return (
        <UsK12View analytics={this.props.analytics} finish={this.finish} selectSchool={this.selectSchool} />
      );
    } else if (this.state.stage === 3) {
      return (
        <NotUsK12View analytics={this.props.analytics} selectSchool={this.selectSchool}/>
      )
    }
  },

  render: function(){
    return(this.stateSpecificComponents());
  }
});
