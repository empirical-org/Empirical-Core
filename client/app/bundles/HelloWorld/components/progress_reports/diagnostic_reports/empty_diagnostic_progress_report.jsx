'use strict'

 import React from 'react'

 export default React.createClass({

   render: function () {
     let linkOne, linkTwo, buttonTextOne, buttonTextTwo, content, image
     if (this.props.status === 'assigned') {
       linkOne = '/tools/diagnostic'
       linkTwo = '/teachers/classrooms/activity_planner'
       buttonTextOne = 'Learn More About Diagnostic Reports'
       buttonTextTwo = 'My Activity Packs'
       content = <div>
         <p><i className="fa fa-check-circle"/>You have successfully assigned a diagnostic to your students.</p>
         <p>Once a student completes the activity, you can return to this page to see your reports. In the meantime, you can learn more about Diagnostic Reports.</p>
       </div>
       image = <img src="/images/pages/diagnostic_reports/diagnostic_colored.svg"/>
     } else if (this.props.status === 'unassigned') {
       linkOne = '/teachers/classrooms/assign_activities/assign-a-diagnostic'
       linkTwo = '/tools/diagnostic'
       buttonTextOne = 'Assign Entry Diagnostic'
       buttonTextTwo = 'Learn More'
       content = <div>
         <p>Hi! This is where your students' diagnostic reports are stored, but it's empty at the moment since you have not yet assigned a diagnostic.</p>
         <p>Let's assign your first diagnostic.</p>
       </div>
       image = <img src="/images/pages/diagnostic_reports/diagnostic_gray.svg"/>
     }
 		return (
        <div className="container">
          <div className="row diagnostic-empty-state">
            <div className="col-xs-7">
              <h1>Quill Diagnostic Reports</h1>
              {content}
              <button onClick={() => {window.location = linkOne}} className="button-green create-unit featured-button">{buttonTextOne}</button>
              <button onClick={() => {window.location = linkTwo}} className="create-unit featured-button">{buttonTextTwo}</button>
            </div>
            <div className="col-xs-4">
              {image}
            </div>
          </div>
        </div>
    )}
})
