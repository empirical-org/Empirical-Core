import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/Header.scss'

import getParameterByName from '../helpers/getParameterByName';

const logoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`
const mobileLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white-mobile.svg`

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      sessionID: getParameterByName('student', window.location.href)
    }
  }

  goToLMS = () => {
    window.location.href = `${process.env.EMPIRICAL_BASE_URL}`
  }

  saveAndExit = () => {
    const { sessionID, } = this.state
    if (sessionID) {
    } else {
      this.goToLMS()
    }
  }

  render() {
    return (
      <div className="header">
        <div>
          <img className="hide-on-desktop" src={mobileLogoSrc} />
          <img className="hide-on-mobile" src={logoSrc} />
          <span className="save-and-exit" onClick={this.saveAndExit}>Save and exit</span>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state: any) => {
  return {
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
      dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
