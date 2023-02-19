import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/headerStyling.scss'

import getParameterByName from '../helpers/getParameterByName';

const quillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`

import {
  updateSessionOnFirebase,
} from "../actions/session";

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      firebaseSessionID: getParameterByName('student', window.location.href)
    }
  }

  goToLMS = () => {
    window.location.href = `${import.meta.env.DEFAULT_URL}`
  }

  handleSaveAndExitClick = () => {
    const { session, dispatch, } = this.props
    const { firebaseSessionID, } = this.state
    if (firebaseSessionID) {
      const { passage, timeTracking, } = session
      dispatch(updateSessionOnFirebase(firebaseSessionID, { passage, timeTracking, }, this.goToLMS))
    } else {
      this.goToLMS()
    }
  }

  render() {
    return (
      <div className="header">
        <div className="activity-navbar-content">
          <a className="focus-on-dark" href={import.meta.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
          <button className="focus-on-dark" onClick={this.handleSaveAndExitClick} type="button">Save and exit</button>
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
