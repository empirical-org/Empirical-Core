'use strict'

 import React from 'react'
 import $ from 'jquery'
 import AnalyticsWrapper from '../../../shared/analytics_wrapper'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  analytics: function() {
    return new AnalyticsWrapper();
  },

  goToEditStudents: function(){
    const ut = this.props.data
    const name = encodeURIComponent(ut.name);
    const activityIds = encodeURIComponent(ut.activities.map((act)=>act.id).toString())
    window.location = `/teachers/classrooms/activity_planner/new_unit/students/edit/name/${name}/activity_ids/${activityIds}`
  },

  fastAssign: function() {
    $.ajax({
      url: '/teachers/unit_templates/fast_assign',
      data: {
        id: this.props.data.id
      },
      type: 'POST',
      success: this.onFastAssignSuccess,
      error: (response) => {
        const errorMessage = jQuery.parseJSON(response.responseText).error_message
        window.alert(errorMessage)
      }
    })
  },

  onFastAssignSuccess: function() {
    this.analytics().track('click Create Unit', {});
    window.location = `/teachers/classrooms/activity_planner/featured-activity-packs/${this.props.data.id}/assigned`
  },


  propsSpecificComponent: function () {
    if (this.props.data.non_authenticated) {
      return <a href="/account/new"><button className='button-green full-width'>Sign Up to Assign This Activity Pack</button></a>
    // } else if (!this.props.data.firstAssignButtonClicked && ($('.tab-pane').data().students === true)) {
    //   return <button className='button-green full-width' onClick={this.props.actions.clickAssignButton}>Assign to Your Class</button>
    // } else if (!this.props.data.firstAssignButtonClicked && ($('.tab-pane').data().students === false)) {
    //   return <button className='button-green full-width' onClick={this.props.actions.fastAssign}>Assign to Your Class</button>
    } else {
      return (<span>
        <button className='button-green full-width' onClick={this.fastAssign}>Assign to All Students</button>
        <button className='button-green full-width' onClick={this.goToEditStudents}>Customize Students</button>
      </span>)
    }
  },

  render: function () {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: {this.props.data.time} mins</p>
      </div>
    )
  }
});
