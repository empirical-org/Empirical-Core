import React from 'react'

export default React.createClass({

  switchToDiagnosticAssign: function(){
    window.location.href = '/diagnostic#/stage/1'
  },

	render: function() {
		return (
        <div className="container manage-units">
          <div className="row empty-unit-manager">
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
