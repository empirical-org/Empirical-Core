import React from 'react'
import $ from 'jquery'

export default class extends React.Component {
  UNSAFE_componentWillMount = () => {
    $('.diagnostic-tab').addClass('active');
    $('.activity-analysis-tab').removeClass('active');
  };

  switchToDiagnosticAssign = () => {
    window.location.href = '/assign/diagnostic'
  };

  render() {
    return (
      <div className="container manage-units">
        <div className="row empty-state-manager">
          <div className="col-xs-7">
            <p>Welcome! This is where you'll be able to see reports detailing your students' diagnostic results, but they haven't completed a diagnostic yet.</p>
            <p>Let's add your first diagnostic!</p>
          </div>
          <div className="col-xs-4">
            <button className="button-green create-unit featured-button" onClick={this.switchToDiagnosticAssign}>Assign Diagnostic</button>
          </div>
        </div>
      </div>
    );
  }
}
