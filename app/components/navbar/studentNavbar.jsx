import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { updateLanguage } from '../../actions/diagnostics.js';

const Navbar = React.createClass({
  getInitialState() {
    return {
      expanded: false,
    };
  },

  navStyles() {
    if (this.state.expanded) {
      return {
        background: '#fff',
        display: 'initial',
      };
    }
  },

  toggle() {
    this.setState({ expanded: !this.state.expanded, });
  },

  reset() {
    this.setState({ expanded: false, });
  },

  saveAndExitConfirm() {
    if (window.confirm('To access your saved progress, you will need to resume the activity on this device with this browser.')) {
      window.location.assign(`${process.env.EMPIRICAL_BASE_URL}/profile`);
    }
  },

  updateLanguage(event) {
    const language = event.target.value;
    this.props.dispatch(updateLanguage(language));
  },

  renderLanguageSelector() {
    if (window.location.href.includes('play/diagnostic/ell')) {
      return (
        <div>
          <select name="language" value={this.props.language} onChange={event => this.updateLanguage(event)}>
            <option value="english"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />English</option>
            <option value="spanish"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />Español</option>
            <option value="chinese"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png" />中文</option>
            <option value="french"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png" />Français</option>
            <option value="vietnamese"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png" />Tiếng Việt</option>
            <option value="arabic"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png" />العربي</option>
            <option value="hindi"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png" />हिंद</option>
          </select>
        </div>
      );
    }
  },

  renderLinks() {
    return (
      <div className="nav-right nav-menu" style={this.navStyles()}>
        {this.renderLanguageSelector()}
        <a onClick={this.saveAndExitConfirm} className="nav-item" activeClassName="is-active">Save & Exit</a>
      </div>
    );
  },

  render() {
    return (
      <header className="nav student-nav" style={{ height: '50px', }}>
        <div className="container">
          <div className="nav-left">
            <a href={`${process.env.EMPIRICAL_BASE_URL}`} className="nav-item">
              <img
                src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png"
                alt=""
                style={{ height: '35px', }}
              />
            </a>
          </div>
          {this.renderLinks()}
          <span className="nav-toggle" onClick={this.toggle}>
            <span />
            <span />
            <span />
          </span>
        </div>
      </header>
    );
  },
});

const rightNav = (<div className="nav-right nav-menu">
  <span className="nav-item">
    <Link to={'/admin'} className="nav-item" activeClassName="is-active">Admin</Link>
  </span>
  <span className="nav-item">
    <a href="#">
      Help
    </a>
  </span>
  <span className="nav-item">
    <a className="button" href="#">Button</a>
  </span>
</div>);

function select(state) {
  return {
    routing: state.routing,
  };
}

export default connect(select)(Navbar);
