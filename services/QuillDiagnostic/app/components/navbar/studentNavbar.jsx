import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LanguageSelector from './languageSelector.jsx';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

class Navbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  navStyles = () => {
    const { expanded, } = this.state
    if (expanded) {
      return {
        background: '#fff',
        display: 'initial',
      };
    }
  }

  handleToggleClick = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded, }));
  }

  reset = () => {
    this.setState({ expanded: false, });
  }

  handleSaveAndExitClick = () => {
    if (window.confirm('To access your saved progress, you will need to resume the activity on this device with this browser.')) {
      window.location.assign(`${process.env.EMPIRICAL_BASE_URL}/profile`);
    }
  }

  ellDiagnostic = () => {
    return window.location.href.includes('play/diagnostic/ell');
  }

  renderLinks = () => {
    const navMenu = this.ellDiagnostic() ? '' : 'nav-menu';
    return (
      <div className={`nav-right ${navMenu}`} style={this.navStyles()}>
        {this.renderLessonSpecificContent()}
        <a activeClassName="is-active" className="nav-item" key="a-tag-student-navabar" onClick={this.handleSaveAndExitClick}>Save & Exit</a>
      </div>
    );
  }

  renderLessonSpecificContent = () => {
    if (this.ellDiagnostic()) {
      return (
        <LanguageSelector key="language-selector" />
      );
    }
  }

  render = () => {
    return (
      <header className='nav student-nav' style={{ height: '50px', }}>
        <div className="container">
          <div className="nav-left">
            <a className="nav-item" href={`${process.env.EMPIRICAL_BASE_URL}`}>
              <img
                alt="Quill.org logo"
                src={quillLogoSrc}
                style={{ height: '35px', }}
              />
            </a>
          </div>
          {this.renderLinks()}
          <span className="nav-toggle" onClick={this.handleToggleClick}>
            <span />
            <span />
            <span />
          </span>
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
