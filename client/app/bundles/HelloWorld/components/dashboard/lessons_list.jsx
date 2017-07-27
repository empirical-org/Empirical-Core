import React from 'react';
import request from 'request';

import PreviewOrLaunchModal from '../shared/preview_or_launch_modal'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: null,
      showModal: false
    };

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    this.getListOfAssignedLessons();
  }

  getListOfAssignedLessons() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classroom_activities/lessons_units_and_activities`,
    },
    (e, r, lessons) => {
      that.setState({ lessons: JSON.parse(lessons).data, });
    });
  }

  openModal() {
    this.setState({showModal: true})
  }

  closeModal() {
    this.setState({showModal: false})
  }

  renderAssignedLessons() {
    const lessons = this.state.lessons;
    const rows = [];
    for (let i = 0; i < Math.min(4, lessons.length); i++) {
      const l = lessons[i];
      rows.push(
        <div key={JSON.stringify(l)}>
          {this.renderModal(l.classroom_activity_id, l.activity_uid)}
          <div className="flex-row space-between vertically-centered lesson-item">
            <div className="flex-row vertically-centered">
              <div className="image-container flex-row space-around vertically-centered">
                <img alt="quill-logo" src="/images/lesson_icon_green.svg" />
              </div>
              <span onClick={this.openModal} className="lesson-name">{l.name}</span>
            </div>
            <a href={`/teachers/classrooms/activity_planner/lessons/${l.activity_id}/unit/${l.unit_id}`} className="q-button bg-quillgreen text-white">Launch Lesson</a>
          </div>
        </div>
      );
    }
    return rows;
  }

  renderModal(classroomActivityID, lessonUID) {
    if (this.state.showModal) {
      return <PreviewOrLaunchModal lessonUID={lessonUID} classroomActivityID={classroomActivityID} closeModal={this.closeModal}/>
    }
  }

  render() {
    if (this.state.lessons && this.state.lessons.length) {
      return (
        <div className="mini_container results-overview-mini-container col-md-8 col-sm-10 text-center lessons-list">
          <div className="inner-container">
            <div className="header-container flex-row space-between vertically-centered lesson-item">
              <h3 >
                List of Recently Assigned Quill Lessons
              </h3>
              <a href="/teachers/classrooms/activity_planner">View All Assigned Lessons </a>
            </div>
            {this.renderAssignedLessons()}
          </div>
        </div>);
    }
    return <span />;
  }
}
