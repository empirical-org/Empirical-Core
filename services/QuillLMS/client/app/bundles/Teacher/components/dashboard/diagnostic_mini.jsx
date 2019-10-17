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
      <p>View our recommendations for each&nbsp;student.</p>
      <a className="bg-quillgreen text-white" href={`/teachers/progress_reports/diagnostic_reports#/u/${unitInfo.unit_id}/a/${unitInfo.activity_id}/c/${unitInfo.classroom_id}/recommendations`}>View Recommended Activities</a>
    </div>);
  }

  awaitingStudentsMini() {
    return (<div className="mini_content diagnostic-mini awaiting-students">
      <div className="gray-underline">
        <h3>Diagnostic Assigned</h3>
      </div>

      <img alt="" src={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`} />
      <p>The diagnostic is waiting for students on their dashboards. Have students log in to complete it so you can assign their recommended&nbsp;activities.</p>
    </div>);
  }

  assignDiagnosticMini() {
    return (<div className="mini_content diagnostic-mini assign-diagnostic">
      <div className="gray-underline">
        <h3>Assign a Diagnostic</h3>
      </div>

      <img alt="" src={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`} />
      <p>See which skills students need to work on and get recommended learning&nbsp;plans.</p>
      <a className="bg-quillgreen text-white" href={'/teachers/classrooms/assign_activities/assign-a-diagnostic'}>Assign Diagnostic</a>
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
