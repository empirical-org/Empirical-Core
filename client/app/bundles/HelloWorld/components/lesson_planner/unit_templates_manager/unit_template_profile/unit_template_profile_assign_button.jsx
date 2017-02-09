'use strict'

 import React from 'react'
 import $ from 'jquery'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  goToEditStudents: function(){
    const ut = this.props.data.model
    const name = encodeURIComponent(ut.name);
    const activityIds = encodeURIComponent(ut.activities.map((act)=>act.id).toString())
    window.location = `./lesson_planner#/new_unit/students/edit/name/${ut.name}/activity_ids/${activityIds}`
  },

  propsSpecificComponent: function () {
    if (this.props.data.non_authenticated) {
      return <button className='button-green full-width' onClick={this.props.actions.signUp}>Sign Up to Assign This Activity Pack</button>
    } else if (!this.props.data.firstAssignButtonClicked && ($('.tab-pane').data().students === true)) {
      return <button className='button-green full-width' onClick={this.props.actions.clickAssignButton}>Assign to Your Class</button>
    } else if (!this.props.data.firstAssignButtonClicked && ($('.tab-pane').data().students === false)) {
      return <button className='button-green full-width' onClick={this.props.actions.fastAssign}>Assign to Your Class</button>
    } else {
      return (<span>
        <button className='button-green full-width' onClick={this.props.actions.fastAssign}>Assign to All Students</button>
        <button className='button-green full-width' onClick={this.goToEditStudents}>Customize Students and Due Dates</button>
      </span>)
    }
  },

  render: function () {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: {this.props.data.model.time} mins</p>
      </div>
    )
  }
});
