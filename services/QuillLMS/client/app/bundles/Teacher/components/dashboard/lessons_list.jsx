import React from 'react';
import request from 'request';

import PreviewOrLaunchModal from '../shared/preview_or_launch_modal';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: null,
      showModal: false,
      completedDiagnosticUnitInfo: null,
      loading: true
    };
  }

  componentDidMount() {
    this.getListOfAssignedLessons();
    this.getCompletedDiagnosticInfo();
  }

  getCompletedDiagnosticInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/completed_diagnostic_unit_info`,
    },
    (e, r, body) => {
      that.setState({ completedDiagnosticUnitInfo: JSON.parse(body).unit_info, }, this.checkIfStillLoading);
    });
  }

  getListOfAssignedLessons() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classroom_units/lessons_units_and_activities`,
    },
    (e, r, lessons) => {
      that.setState({ lessons: JSON.parse(lessons).data, }, this.checkIfStillLoading);
    });
  }

  checkIfStillLoading() {
    if (this.state.lessons && this.state.completedDiagnosticUnitInfo) {
      this.setState({loading: false})
    }
  }

  closeModal = () => {
    this.setState({ showModal: false, });
  };

  openModal = activityID => {
    this.setState({ showModal: activityID, });
  };

  renderAssignedLessons() {
    const lessons = this.state.lessons;
    const rows = [];
    for (let i = 0; i < Math.min(4, lessons.length); i++) {
      const l = lessons[i];
      rows.push(
        <div key={JSON.stringify(l)}>
          {this.renderModal(l.activity_id)}
          <div className="flex-row space-between vertically-centered lesson-item">
            <div className="flex-row vertically-centered">
              <div className="image-container flex-row space-around vertically-centered">
                <img alt="quill-logo" src="/images/lesson_icon_green.svg" />
              </div>
              <span className="lesson-name" onClick={() => this.openModal(l.activity_id)}>{l.name}</span>
            </div>
            <a className="q-button bg-quillgreen text-white" href={`/teachers/units/select_lesson/${l.activity_id}`}>Launch Lesson</a>
          </div>
        </div>
      );
    }
    return rows;
  }

  renderModal(lessonID) {
    if (this.state.showModal === lessonID) {
      return (<PreviewOrLaunchModal
        closeModal={this.closeModal}
        lessonID={lessonID}
      />);
    }
  }

  renderModalContent() {
    if (this.state.lessons && this.state.lessons.length) {
      return (<div className="inner-container">
        <div className="header-container flex-row space-between vertically-centered lesson-item">
          <h3 >
            List of Assigned Quill Lessons
          </h3>
          <a href="/teachers/classrooms/activity_planner/lessons">View All Assigned Lessons </a>
        </div>
        {this.renderAssignedLessons()}
      </div>)
    } else if (this.state.completedDiagnosticUnitInfo && Object.keys(this.state.completedDiagnosticUnitInfo).length > 0) {
      const {unit_id, classroom_id, activity_id} = this.state.completedDiagnosticUnitInfo
      return (<div className="inner-container">
        <div className="header-container flex-row space-between vertically-centered lesson-item">
          <h3 >
            List of Assigned Quill Lessons
          </h3>
          <a href={`/teachers/progress_reports/diagnostic_reports#/u/${unit_id}/a/${activity_id}/c/${classroom_id}/recommendations`}>View and Assign Quill Recommendations </a>
        </div>
        <div className="no-assigned-lessons completed-diagnostic">
          <img src={`${process.env.CDN_URL}/images/illustrations/empty_state_lessons_launch_card.svg`} />
          <p>Based on your class performance on the diagnostic, your students need instructions in concepts such as <span className="recommendation">Complex Sentences</span>, <span className="recommendation">Fragments</span> and <span className="recommendation">Compound Sentences</span>.</p>
        </div>
      </div>)
    } else if (this.state.loading) {
      return <div className="inner-container" />
    } else {
      return (<div className="inner-container">
        <div className="header-container flex-row space-between vertically-centered lesson-item">
          <h3 >
            List of Assigned Quill Lessons
          </h3>
          <a href="/assign/activity-library?activityClassificationFilters[]=lessons">View and Assign Quill Lessons </a>
        </div>
        <div className="no-assigned-lessons">
          <img src={`${process.env.CDN_URL}/images/illustrations/empty_state_lessons_launch_card.svg`} />
          <p>Once you assign a shared group lesson, you can launch it from this window.</p>
          <p>Quill Lessons provides whole-class lessons that are led by the teacher.</p>
          <p>Select questions for your students and instantly see their responses. <a href="/tools/lessons" target="_blank">Learn More</a></p>
        </div>
      </div>)
    }
  }

  render() {
      return (
        <div className="mini_container results-overview-mini-container col-md-8 col-sm-10 text-center lessons-list">
          {this.renderModalContent()}
        </div>);
    return <span />;
  }
}
