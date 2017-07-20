import React from 'react';
import { connect } from 'react-redux';

const Navbar = React.createClass({
  render() {
    const data = this.props.classroomSessions.data;
    const lessonData = this.props.classroomLesson.data;
    const bothNames = data.teacher_name && data.classroom_name;
    const teacherAndClassroom = bothNames ? `${data.teacher_name} - ${data.classroom_name}` : data.teacher_name || data.classroom_name;
    const lessonName = lessonData ? `${lessonData.lesson}: ${lessonData.title}` : ''
    return (
      <header className={'nav student-nav'} style={{ height: '66px', }}>
        <nav className="student-lessons">
          <a href={`${process.env.EMPIRICAL_BASE_URL}`} >
            <img
              className="quill-logo"
              src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png"
              alt="quill-logo"
            />
          </a>
          <div className="lesson-name" key="lesson-name">Lesson {lessonName}</div>
          <div className="teacher-name">{teacherAndClassroom || ''}</div>
        </nav>
      </header>
    );
  },
});

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(Navbar);
