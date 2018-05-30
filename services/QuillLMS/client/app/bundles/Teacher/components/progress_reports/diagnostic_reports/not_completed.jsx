import React from 'react'
import $ from 'jquery'

export default React.createClass({

  componentWillMount: function(){
    $('.diagnostic-tab').addClass('active');
    $('.activity-analysis-tab').removeClass('active');
  },

  switchToDiagnosticAssign: function(){
    window.location.href = '/teachers/classrooms/assign_activities/assign-a-diagnostic'
  },

	render: function() {
		return (
        <div className="container manage-units">
          <div className="row empty-state-manager">
            <div className="col-xs-7">
              <p>Welcome! This is where you'll be able to see reports detailing your students' diagnostic results, but they haven't completed a diagnostic yet.</p>
              <p>Let's add your first diagnostic!</p>
            </div>
            <div className="col-xs-4">
              <button onClick={this.switchToDiagnosticAssign} className="button-green create-unit featured-button">Assign Diagnostic</button>
            </div>
          </div>
      </div>
		);
	}
});
