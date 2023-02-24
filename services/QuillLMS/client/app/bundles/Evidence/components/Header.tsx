import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import { TrackAnalyticsEvent } from '../actions/analytics';
import { Events } from '../modules/analytics';
import '../styles/headerStyling.scss'

import getParameterByName from '../helpers/getParameterByName';
import { Tooltip, READ_PASSAGE_STEP_NUMBER, BECAUSE_PASSAGE_STEP_NUMBER, BUT_PASSAGE_STEP_NUMBER, SO_PASSAGE_STEP_NUMBER, whiteCheckGreenBackgroundIcon } from '../../Shared/index'
import { onMobile } from '../helpers/containerActionHelpers';

const logoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`
const mobileLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-mobile.svg`
const helpIcon = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-help-white.svg`
const checkIcon = <img alt={whiteCheckGreenBackgroundIcon.alt} src={whiteCheckGreenBackgroundIcon.src} />;

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
    const { dispatch } = this.props
    const { sessionID, } = this.state
    const activityID = getParameterByName('uid', window.location.href)
    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_ACTIVITY_SAVED, {
      activityID: activityID,
      sessionID
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

  renderNumberOrIcon = (step: number) => {
    const { session } = this.props;
    const { activeStep } = session;
    if(step < activeStep) {
      return checkIcon;
    }
    if(step === activeStep) {
      return <div className="evidence-step-number-small active">{step}</div>
    }
    return <div className="evidence-step-number-small">{step}</div>
  }

  renderStepCounter = () => {
    return(
      <div className="nav-steps-count-container">
        <p className="step-counter-label">Steps</p>
        {this.renderNumberOrIcon(READ_PASSAGE_STEP_NUMBER)}
        {this.renderNumberOrIcon(BECAUSE_PASSAGE_STEP_NUMBER)}
        {this.renderNumberOrIcon(BUT_PASSAGE_STEP_NUMBER)}
        {this.renderNumberOrIcon(SO_PASSAGE_STEP_NUMBER)}
      </div>
    );
  }

  render() {
    const { session } = this.props;
    const { explanationSlidesCompleted, activityIsComplete } = session;
    const showStepsCounter = explanationSlidesCompleted && !activityIsComplete
    const isNotTurk = !window.location.href.includes('turk')
    const tooltipTrigger = <div><img alt="Question mark icon" src={helpIcon} /><span>Beta: <span>in development</span></span></div>
    const mobileStyle = onMobile() || !showStepsCounter ? 'mobile' : '';
    return (
      <div className="header">
        <div className={`inner-header ${mobileStyle}`}>
          <div className={`left-side-container ${mobileStyle}`}>
            <div className="left-side">
              <a className="focus-on-dark" href={import.meta.env.VITE_DEFAULT_URL}>
                <img alt="Quill.org logo" className="hide-on-desktop" src={mobileLogoSrc} />
                <img alt="Quill.org logo" className="hide-on-mobile" src={logoSrc} />
              </a>
              <Tooltip
                tooltipText="Quill Reading for Evidence is in beta, which means that it’s not perfect yet. As you complete activities, you may notice some issues—a button may not work or some feedback could be unhelpful. Please know that we’re actively working on Quill Reading for Evidence and making improvements every day."
                tooltipTriggerText={tooltipTrigger}
                tooltipTriggerTextClass="hide-on-mobile beta-tag focus-on-dark"
              />
              <span className="hide-on-desktop beta-tag">Beta</span>
            </div>
          </div>
          <div className={`right-side-container ${mobileStyle}`}>
            {showStepsCounter && !onMobile() && this.renderStepCounter()}
            {isNotTurk && <button className="save-and-exit focus-on-dark" onClick={this.handleOnClick} type="button"><span>Save and exit</span></button>}
          </div>
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
