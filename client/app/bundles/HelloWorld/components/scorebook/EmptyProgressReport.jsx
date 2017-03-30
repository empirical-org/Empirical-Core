'use strict'

 import React from 'react'

 export default React.createClass({

   render: function () {
     let link, buttonText, content
     if (this.props.missing === 'activities') {
       link = '/teachers/classrooms/activity_planner/assign-new-activity'
       buttonText = 'Assign an Activity'
       content = <div>
         <p>Welcome! This is where your student reports will be stored, but you haven't assigned any activities yet.</p>
         <p>Let's add your first activity.</p>
       </div>
     } else if (this.props.missing === 'students') {
       link = '/teachers/classrooms/invite_students'
       buttonText = 'Invite Students'
       content = <div>
         <p>Welcome! This is where your student reports will be stored, but you haven't invited any students yet.</p>
         <p>Let's invite some students.</p>
       </div>
     } else {
       link = '/teachers/classrooms/new'
       buttonText = 'Create a Class'
       content = <div>
         <p>Welcome! This is where your student reports will be stored, but you don't have any classrooms yet.</p>
         <p>Let's add your first class.</p>
       </div>

     }
 		return (
        <div className="container">
          <div className="row empty-state-manager">
            <div className="col-xs-7">
              {content}
            </div>
            <div className="col-xs-4">
              <button onClick={() => {window.location = link}} className="button-green create-unit featured-button">{buttonText}</button>
            </div>
          </div>
        </div>
    )}
})
