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
      const parsedResponse = JSON.parse(response)
      that.setState({
        unitInfo: parsedResponse.unit_info,
        numberOfFinishedDiagnostics: parsedResponse.number_of_finished_students,
        status: parsedResponse.status
      });
    });
  }

  assignRecommendationsMini() {
    const { unitInfo, numberOfFinishedDiagnostics, } = this.state;

    return (<div className="mini_content diagnostic-mini assign-recommendations">
      <div className="gray-underline">
        <h3>{numberOfFinishedDiagnostics} Completed Diagnostic{Number(numberOfFinishedDiagnostics) === 1 ? '' : 's'}</h3>
      </div>
      <img src={`${process.env.CDN_URL}/images/shared/diagnostics_completed.svg`} />
      <p>Your students have been recommended activities such as <span>Compound Sentences</span> and <span>Fragments</span>.</p>
      <a href={`/teachers/progress_reports/diagnostic_reports#/u/${unitInfo.unit_id}/a/${unitInfo.activity_id}/c/${unitInfo.classroom_id}/recommendations`} className="bg-quillgreen text-white">View Recommended Activities</a>
    </div>);
  }

  awaitingStudentsMini() {
    return (<div className="mini_content diagnostic-mini awaiting-students">
      <div className="gray-underline">
        <h3>Awaiting Students' Completion</h3>
      </div>

      <img alt="" src={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`} />
      <p>Ask your students to login and complete the diagnostic so you can assign recommended activities. You can also <a href="/teachers/classrooms/activity_planner">set due dates here</a>.</p>
    </div>);
  }

  assignDiagnosticMini() {
    return (<div className="mini_content diagnostic-mini assign-diagnostic">
      <div className="gray-underline">
        <h3>Assign A Diagnostic</h3>
      </div>

      <img alt="" src={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`} />
      <p>See which skills students need to work on and get recommended learning plans.</p>
      <a href={'/teachers/classrooms/assign_activities/assign-a-diagnostic'} className="bg-quillgreen text-white">Assign Diagnostic</a>
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
