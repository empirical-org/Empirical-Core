import React from 'react';
import { connect } from 'react-redux';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

const handleLogoClick = () => {
  if (window.confirm('Are you sure you want to leave your lesson?')) {
    window.location = process.env.EMPIRICAL_BASE_URL;
  }
}

const getSlideName = (editionData, data) => {
  if (!(editionData && editionData.questions && data)) { return '' }

  if (data.current_slide > 0) {
    return [<span key="slide-number">Slide {parseInt(data.current_slide)}</span>, `: ${editionData.questions[data.current_slide].data.teach.title}`]
  }

  return "Lobby"
}

const Navbar = ({ classroomSessions, classroomLesson, customize, }) => {
  const { data } = classroomSessions;
  const lessonData = classroomLesson.data;
  const editionData = customize.editionQuestions;

  return (
    <header className='nav student-nav'>
      <nav className="student-lessons">
        <img
          alt="Quill.org logo"
          className="quill-logo"
          onClick={handleLogoClick}
          src={quillLogoSrc}
        />
        <div className="slide-name" key="slide-name">{getSlideName(editionData, data)}</div>
        <div className="lesson-name">{lessonData.title}</div>
      </nav>
    </header>
  );
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

export default connect(select)(Navbar);
