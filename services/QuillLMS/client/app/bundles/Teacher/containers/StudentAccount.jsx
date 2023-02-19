import React, { Component } from 'react';
import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index';
import StudentGeneralAccountInfo from '../components/accounts/edit/student_general.jsx';
import StudentPasswordAccountInfo from '../components/accounts/edit/update_password';
import getAuthToken from '../components/modules/get_auth_token';
import { requestPut } from '../../../modules/request/index';
import _ from 'lodash';

const GENERAL = 'general'
const PASSWORD = 'password'

export default class StudentAccount extends Component {
  constructor(props) {
    super(props);
    const { name, userName, email, timeZone, } = props;
    this.state = {
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      userName,
      email,
      timeZone,
      snackbarCopy: '',
      activeSection: null,
      timesSubmitted: 0,
      errors: {}
    };
  }

  activateGeneralSection = () => this.activateSection(GENERAL)

  activatePasswordSection = () => this.activateSection(PASSWORD)

  activateSection = (section) => {
    this.setState({ activeSection: section, })
  }

  deactivateGeneralSection = () => this.deactivateSection(GENERAL)

  deactivatePasswordSection = () => this.deactivateSection(PASSWORD)

  deactivateSection = (section) => {
    const { activeSection, } = this.state
    if (activeSection === section) {
      this.setState({ activeSection: null, errors: {} });
    }
  }

  showSnackbar = () => {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  updateUser = (data, url, snackbarCopy, errors) => {
    if(!_.isEmpty(errors)) {
      // combine front and backend errors if any lingering backend errors remain
      this.setState(prevState => {
        const errorsObject = {...prevState.errors}
        const { firstName, lastName, username, time_zone, } = errors;
        errorsObject.firstName = firstName;
        errorsObject.lastName = lastName;
        errorsObject.username = username ? username : errorsObject.username;
        errorsObject.timeZone = time_zone;
        return { errors: errorsObject }
      });
    } else {
      const { timesSubmitted } = this.state;
      let dataObject = data;
      dataObject.authenticity_token = getAuthToken();
      requestPut(`${import.meta.env.DEFAULT_URL}${url}`, dataObject, (body) => {
        const {
          name,
          username,
          email,
          time_zone,
        } = body.user;
        this.setState({
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          userName: username,
          timeZone: time_zone,
          email,
          snackbarCopy,
          errors: {}
        }, () => {
          this.showSnackbar();
          this.setState({ activeSection: null });
        });
      }, (error) => {
        this.setState({ errors: error.errors, timesSubmitted: timesSubmitted + 1, });
      });
    }
  }

  renderExplanation = () => {
    const { cleverId, } = this.props
    const accountType = cleverId ? 'Clever' : 'Google';
    return(
      <div className="user-account-section third-party-integration-explanation">
        <div className="third-party-integration-explanation header">
          <h4>Why can&#39;t I edit my account information?</h4>
          <img alt="Lightbulb with rays shining" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/bulb.svg`} />
        </div>
        <p className="third-party-integration-explanation text">{`Your information is linked to your ${accountType} account. Go to your ${accountType} account settings to change your name, username, email or password.`}</p>
      </div>
    );
  }

  renderLinkedAccount = () => {
    const { cleverId, googleId } = this.props;
    if(cleverId || googleId ) {
      const label = cleverId ? 'clever' : 'google';
      const path = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/${label}_icon.svg`
      return(
        <div className="user-linked-accounts user-account-section">
          <h1>Linked accounts</h1>
          <div className={`${label}-row`}>
            <div className="first-half">
              <img alt={`${label} icon`} src={path} />
              <span>{`${label[0].toUpperCase()}${label.slice(1)} account is linked`}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  renderSnackbar = () => {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  render() {
    const { firstName, lastName, userName, email, timeZone, timesSubmitted, activeSection, errors } = this.state;
    const { googleId, cleverId, accountType, role, isBeingPreviewed, } = this.props;
    return(
      <div className="user-account">
        {(cleverId || googleId) && this.renderExplanation()}
        <StudentGeneralAccountInfo
          accountType={accountType}
          activateSection={this.activateGeneralSection}
          active={activeSection === GENERAL}
          cleverId={cleverId}
          deactivateSection={this.deactivateGeneralSection}
          email={email}
          errors={errors}
          firstName={firstName}
          googleId={googleId}
          isBeingPreviewed={isBeingPreviewed}
          lastName={lastName}
          timesSubmitted={timesSubmitted}
          timeZone={timeZone}
          updateUser={this.updateUser}
          userName={userName}
        />
        <StudentPasswordAccountInfo
          activateSection={this.activatePasswordSection}
          active={activeSection === PASSWORD}
          cleverId={cleverId}
          deactivateSection={this.deactivatePasswordSection}
          errors={errors}
          googleId={googleId}
          isBeingPreviewed={isBeingPreviewed}
          role={role}
          timesSubmitted={timesSubmitted}
          updateUser={this.updateUser}
        />
        {this.renderLinkedAccount()}
        {this.renderSnackbar()}
      </div>
    );
  }
}
