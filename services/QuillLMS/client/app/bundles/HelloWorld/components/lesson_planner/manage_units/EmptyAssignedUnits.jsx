'use strict'

 import React from 'react'

 export default React.createClass({

  componentWillMount(){
    $('.diagnostic-tab').removeClass('active');
    $('.activity-analysis-tab').addClass('active');
  },

  handleClick() {
    window.location = '/teachers/classrooms/assign_activities'
  },

   render: function () {
 		return (
        <div className="container">
          <div className="row empty-state-manager">
            <div className="col-xs-7">
              <p>Welcome! This is where your assigned activity packs are stored, but it's empty at the moment.</p>
              <p>Let's add your first activity.</p>
            </div>
            <div className="col-xs-4">
              <button onClick={this.handleClick} className="button-green create-unit featured-button">Assign An Activity</button>
            </div>
          </div>
        </div>
    )}
})
