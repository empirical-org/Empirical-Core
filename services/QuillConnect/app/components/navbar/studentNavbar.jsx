import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

const handleSaveAndExitClick = () => {
  if (window.confirm('To access your saved progress, you will need to resume the activity on this device with this browser.')) {
    window.location.assign(`${process.env.EMPIRICAL_BASE_URL}/profile`);
  }
}

const renderLinks = () => (
  <div className="student-nav-section">
    <a activeClassName="is-active" className="student-nav-item focus-on-dark" key="a-tag-student-navabar" onClick={handleSaveAndExitClick} tabIndex="0">Save and exit</a>
  </div>
);

const Navbar = () => (
  <header className='nav student-nav'>
    <div className="container">
      <div className="student-nav-section">
        <a aria-label="Quill" className="student-nav-item focus-on-dark" href={`${process.env.EMPIRICAL_BASE_URL}`} tabIndex="0">
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

export default connect(select)(Navbar);
