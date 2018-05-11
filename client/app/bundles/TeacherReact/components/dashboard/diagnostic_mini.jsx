import React from 'react';
import _ from 'underscore';
import request from 'request';

export default class DiagnosticMini extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.getDiagnosticInfo();
  }

  getDiagnosticInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/get_diagnostic_info_for_dashboard_mini`,
    },
    (e, r, response) => {
      that.setState(JSON.parse(response));
    });
  }

  assignRecommendationsMini() {
    const { unit_info, number_of_finished_students, } = this.state;

    return (<div className="mini_content diagnostic-mini assign-recommendations">
      <div className="gray-underline">
        <h3>{number_of_finished_students} Student{number_of_finished_students === '1' ? '' : 's'} Completed Diagnostic</h3>
      </div>
      <img src={`${process.env.CDN_URL}/images/pages/diagnostic_reports/Diagnostic_Completion.svg`} />
      <p>Your students have been recommended activities such as <span>Compound Sentences</span> and <span>Fragments</span>.</p>
      <a href={`/teachers/progress_reports/diagnostic_reports#/u/${unit_info.unit_id}/a/${unit_info.activity_id}/c/${unit_info.classroom_id}/recommendations`} className="bg-quillgreen text-white">View and Assign Recommendations</a>
    </div>);
  }

  awaitingStudentsMini() {
    return (<div className="mini_content diagnostic-mini awaiting-students">
      <div className="gray-underline">
        <h3>Diagnostic Assigned</h3>
      </div>

      <img src={`${process.env.CDN_URL}/images/pages/diagnostic_reports/diagnostic_colored.svg`} />
      <p>Once your students log in and complete the diagnostic, you can assign the recommended follow up activities. You can also <a href="/teachers/classrooms/activity_planner">set due dates here</a>.</p>
    </div>);
  }

  assignDiagnosticMini() {
    return (<div className="mini_content diagnostic-mini assign-diagnostic">
      <div className="gray-underline">
        <h3>Assign Entry Diagnostic</h3>
      </div>

      <img src={`${process.env.CDN_URL}/images/pages/diagnostic_reports/diagnostic_colored.svg`} />
      <p>Determine which skills your students need to work on.</p>
      <a href={'/teachers/classrooms/assign_activities/assign-a-diagnostic'} className="bg-quillgreen text-white">View and Assign Diagnostic</a>
    </div>);
  }

  renderDiagnosticMini() {
    let miniContent;
    switch (this.state.status) {
      case 'recently completed':
        miniContent = this.assignRecommendationsMini();
        break;
      case 'assigned':
        miniContent = this.awaitingStudentsMini();
        break;
      case 'unassigned':
        miniContent = this.assignDiagnosticMini();
        break;
      case 'completed':
      default:
        return <span />;
    }
    return (<div className="mini_container results-overview-mini-container col-md-4 col-sm-5 text-center">
      {miniContent}
    </div>);
  }

  render() {
    return this.renderDiagnosticMini();
  }
}
