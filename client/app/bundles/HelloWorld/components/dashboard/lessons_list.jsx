import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getListOfAssignedLessons();
  }

  getListOfAssignedLessons() {
    // make ajax call to get all assigned lessons
    this.setState({ assignedLessons: data, });
  }

  renderAssignedLessons() {
    // const lessons = this.state.assignedLessons
    const lessons = [{ id: '1', name: 'Comound Objects and Predicates', }, { id: '1', name: 'Compound Subjects', }, { id: '1', name: 'Compound Subjects, Objects, and Predicates', }, { id: '1', name: 'Compound Subjects', }];
    const lessonsList = lessons.map(l => (
      <div className>
        <div className="flex-row space-between vertically-centered lesson-item">
          <div className="flex-row vertically-centered">
            <div className="image-container flex-row space-around vertically-centered">
              <img alt="quill-logo" src="/images/lesson_icon_green.svg" />
            </div>
            <span className="">{l.name}</span>
          </div>
          <a href={`/activity_sessions/anonymous?activity_id=${l.id}`} className="q-button bg-quillgreen text-white">Launch Lesson</a>
        </div>
      </div>
      ));
    return (
      <div>
        {lessonsList}
      </div>
    );
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
