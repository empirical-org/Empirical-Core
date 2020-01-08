import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

class Navbar extends React.Component {
  handleSaveAndExitClick = () => {
    if (window.confirm('To access your saved progress, you will need to resume the activity on this device with this browser.')) {
      window.location.assign(`${process.env.EMPIRICAL_BASE_URL}/profile`);
    }
  }

  renderLinks = () => {
    return (
      <div className='nav-right'>
        <a activeClassName="is-active" className="nav-item" key="a-tag-student-navabar" onClick={this.handleSaveAndExitClick}>Save and exit</a>
      </div>
    );
  }

  render = () => {
    return (
      <header className='nav student-nav'>
        <div className="container">
          <div className="nav-left">
            <a className="nav-item" href={`${process.env.EMPIRICAL_BASE_URL}`}>
              <img
                alt="Quill.org logo"
                src={quillLogoSrc}
              />
            </a>
          </div>
          {this.renderLinks()}
        </div>
      </header>
    );
  }
}

function select(state) {
  return {
    routing: state.routing
  };
}

export default connect(select)(Navbar);
