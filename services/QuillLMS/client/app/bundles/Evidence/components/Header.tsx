import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import { TrackAnalyticsEvent } from '../actions/analytics';
import { Events } from '../modules/analytics';
import '../styles/headerStyling.scss'

import getParameterByName from '../helpers/getParameterByName';
import { Tooltip, } from '../../Shared/index'

const logoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`
const mobileLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-mobile.svg`
const helpIcon = `${process.env.CDN_URL}/images/icons/icons-help-white.svg`

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
    const isNotTurk = !window.location.href.includes('turk')
    const tooltipTrigger = <div><img alt="Question mark icon" src={helpIcon} /><span>Beta: <span>in development</span></span></div>
    return (
      <div className="header">
        <div className="inner-header">
          <div className="left-side">
            <a className="focus-on-dark" href={process.env.DEFAULT_URL}>
              <img alt="Quill.org logo" className="hide-on-desktop" src={mobileLogoSrc} />
              <img alt="Quill.org logo" className="hide-on-mobile" src={logoSrc} />
            </a>
            <Tooltip
              isTabbable={true}
              tooltipText="Quill Evidence is in beta, which means that it’s not perfect yet. As you complete activities, you may notice some issues—a button may not work or some feedback could be unhelpful. Please know that we’re actively working on Quill Evidence and making improvements everyday."
              tooltipTriggerText={tooltipTrigger}
              tooltipTriggerTextClass="hide-on-mobile beta-tag focus-on-dark"
            />
            <span className="hide-on-desktop beta-tag">Beta</span>
          </div>
          {isNotTurk && <button className="save-and-exit focus-on-dark" onClick={this.handleOnClick} type="button"><span>Save and exit</span></button>}
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
