import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import { TrackAnalyticsEvent } from '../actions/analytics';
import { Events } from '../modules/analytics';
import '../styles/headerStyling.scss'

import getParameterByName from '../helpers/getParameterByName';

const logoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`
const mobileLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-mobile.svg`

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      sessionID: getParameterByName('student', window.location.href)
    }
  }

  goToLMS = () => {
    window.location.href = "/"
  }

  trackSaveAndExitEvent = () => {
    const { dispatch, } = this.props
    const { sessionID, } = this.state
    const activityID = getParameterByName('uid', window.location.href)
    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ACTIVITY_SAVED, {
      activityID: activityID,
      sessionID,
    }))
  }

  saveAndExit = () => {
    const { sessionID, } = this.state
    this.trackSaveAndExitEvent()
    if (sessionID) {
    } else {
      this.goToLMS()
    }
  }

  handleOnClick = () => {
    this.saveAndExit()
  }

  render() {
    return (
      <div className="header">
        <div>
          <img alt="Quill.org logo" className="hide-on-desktop" src={mobileLogoSrc} />
          <img alt="Quill.org logo" className="hide-on-mobile" src={logoSrc} />
          <button className="save-and-exit" onClick={this.handleOnClick} type="button"><span>Save and exit</span></button>
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
