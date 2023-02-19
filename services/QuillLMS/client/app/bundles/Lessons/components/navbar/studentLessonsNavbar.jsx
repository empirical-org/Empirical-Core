import React from 'react';
import { connect } from 'react-redux';

const quillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`

const handleLogoClick = () => {
  if (window.confirm('Are you sure you want to leave your lesson?')) {
    window.location = import.meta.env.DEFAULT_URL;
  }
}

export const Navbar = ({ classroomSessions, customize, }) => {
  const { data } = classroomSessions;

  // need to subtract one from the number of questions to account for the lobby slide
  const numberOfQuestions = customize && customize.editionQuestions && customize.editionQuestions.questions ? customize.editionQuestions.questions.length - 1 : null
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
    customize: props.customize,
  };
}

export default connect(select)(Navbar);
