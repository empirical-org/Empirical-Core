import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/Header.scss'

import getParameterByName from '../helpers/getParameterByName';

import {
  updateSessionOnFirebase,
} from "../actions/session";

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
          <img src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png" />
          <span className="save-and-exit" onClick={this.saveAndExit}>Save & Exit</span>
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
