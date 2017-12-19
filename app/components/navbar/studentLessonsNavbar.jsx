import React from 'react';
import { connect } from 'react-redux';

const Navbar = React.createClass({
  handleLogoClick() {
    if (window.confirm('Are you sure you want to leave your lesson?')) {
      window.location = process.env.EMPIRICAL_BASE_URL;
    }
  },

  render() {
    const data = this.props.classroomSessions.data;
    const lessonData = this.props.classroomLesson.data;
    const editionData = this.props.customize.editionQuestions;
    let slideName
    if (editionData && editionData.questions && data) {
      if (data.current_slide > 0) {
        slideName = [<span>Slide {parseInt(data.current_slide)}</span>, `: ${editionData.questions[data.current_slide].data.teach.title}`]
      } else {
        slideName = "Lobby"
      }
    } else {
      slideName = ''
    }
    return (
      <header className={'nav student-nav'} style={{ height: '66px', }}>
        <nav className="student-lessons">
          <a onClick={() => this.handleLogoClick()}>
            <img
              className="quill-logo"
              src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png"
              alt="quill-logo"
            />
          </a>
          <div className="slide-name" key="slide-name">{slideName}</div>
          <div className="lesson-name">{lessonData.title}</div>
        </nav>
      </header>
    );
  },
});

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

export default connect(select)(Navbar);
