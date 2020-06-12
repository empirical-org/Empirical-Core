import React from 'react';
import { connect } from 'react-redux';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

const handleLogoClick = () => {
  if (window.confirm('Are you sure you want to leave your lesson?')) {
    window.location = process.env.EMPIRICAL_BASE_URL;
  }
}

export const Navbar = ({ classroomSessions, classroomLesson, customize, }) => {
  const { data } = classroomSessions;
  const lessonData = classroomLesson.data;

  // need to subtract one from the number of questions to account for the lobby slide
  const numberOfQuestions = lessonData && lessonData.questions ? lessonData.questions.length - 1 : null
  const counterText = numberOfQuestions ? `${data.current_slide} of ${numberOfQuestions}` : ''

  return (
    <header className='nav student-nav'>
      <nav className="student-lessons">
        <button
          className="focus-on-dark interactive-wrapper"
          onClick={handleLogoClick}
          type="button"
        >
          <img
            alt="Quill.org logo"
            className="quill-logo"
            src={quillLogoSrc}
          />
        </button>
        <p className="counter">{counterText}</p>
      </nav>
    </header>
  );
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson,
  };
}

export default connect(select)(Navbar);
