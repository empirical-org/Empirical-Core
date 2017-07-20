import React from 'react';
import request from 'request';
import LoadingIndicator from '../shared/loading_indicator.jsx';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      lessons: null,
    };
  }

  componentDidMount() {
    this.getListOfAssignedLessons();
  }

  getListOfAssignedLessons() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classroom_activities/lessons_activities_cache`,
    },
    (e, r, lessons) => that.setState({ lessons: JSON.parse(lessons).data, loading: false, }));
  }

  renderAssignedLessons() {
    const lessons = this.state.lessons;
    let returnEl = <LoadingIndicator />;
    if (lessons && !this.state.loading) {
      returnEl = lessons.map(l => (
        <div className>
          <div className="flex-row space-between vertically-centered lesson-item">
            <div className="flex-row vertically-centered">
              <div className="image-container flex-row space-around vertically-centered">
                <img alt="quill-logo" src="/images/lesson_icon_green.svg" />
              </div>
              <span className="">{l.activity_name}</span>
            </div>
            <a href={`/activity_sessions/anonymous?activity_id=${l.activity_id}`} className="q-button bg-quillgreen text-white">Launch Lesson</a>
          </div>
        </div>
        ));
    }
    return (
      <div>
        {returnEl}
      </div>);
  }

  render() {
    return (
      <div className="mini_container results-overview-mini-container col-md-8 col-sm-10 text-center lessons-list">
        <div className="inner-container">
          <div className="header-container flex-row space-between vertically-centered lesson-item">
            <h3 >
              List of Recently Assigned Quill Lessons
            </h3>
            <a href="/" >View All Assigned Lessons </a>
          </div>
          {this.renderAssignedLessons()}
        </div>
      </div>);
  }
}
