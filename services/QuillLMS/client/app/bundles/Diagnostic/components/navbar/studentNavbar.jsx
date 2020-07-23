import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`

const handleSaveAndExitClick = () => {
  window.location.assign(`${process.env.DEFAULT_URL}/profile`);
}

const renderLinks = () => (
  <div className="student-nav-section">
    <button activeClassName="is-active" className="student-nav-item focus-on-dark" key="a-tag-student-navabar" onClick={handleSaveAndExitClick} tabIndex="0" type="button">Save and exit</button>
  </div>
);

const StudentNavbar = () => (
  <header className='nav student-nav'>
    <div className="container">
      <div className="student-nav-section">
        <a aria-label="Quill" className="student-nav-item focus-on-dark" href={`${process.env.DEFAULT_URL}`} tabIndex="0">
          <img
            alt="Quill.org logo"
            src={quillLogoSrc}
          />
        </a>
      </div>
      {renderLinks()}
    </div>
  </header>
);

function select(state) {
  return {
    routing: state.routing
  };
}

export default connect(select)(StudentNavbar);
