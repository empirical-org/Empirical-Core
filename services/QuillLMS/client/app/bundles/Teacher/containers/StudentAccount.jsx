import React, { Component } from 'react';
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary';
import StudentGeneralAccountInfo from '../components/accounts/edit/student_general.jsx';
import StudentPasswordAccountInfo from '../components/accounts/edit/update_password';
import getAuthToken from '../components/modules/get_auth_token';
import request from 'request';
import _ from 'lodash';

export default class StudentAccount extends Component {
  constructor(props) {
    super(props);
    const { name, userName, email } = props;
    this.state = {
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      userName: userName,
      email: email,
      snackbarCopy: '',
      activeSection: null,
      timesSubmitted: 0,
      errors: {}
    };
  }

  activateSection = (section) => {
    this.setState({ activeSection: section, })
  }

  deactivateSection = (section) => {
    if (this.state.activeSection === section) {
      this.setState({ activeSection: null, errors: {} });
    }
  }

  showSnackbar = () => {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderSnackbar = () => {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  renderLinkedAccount = () => {
    const { cleverId } = this.props;
    const label = cleverId ? 'clever' : 'google';
    const path = cleverId ? `${process.env.CDN_URL}/images/shared/clever_icon.svg` : '/images/google_icon.svg';
    return(
      <div className="user-linked-accounts user-account-section">
        <h1>Linked accounts</h1>
        <div className={`${label}-row`}>
          <div className="first-half">
            <img alt={`${label} icon`} src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} />
            <span>{`${label[0].toUpperCase()}${label.slice(1)} account is linked`}</span>
          </div>
        </div>
      </div>
    );
  }

  renderExplanation = () => {
    const accountType = this.props.cleverId ? 'Clever' : 'Google';
    return(
      <div className="user-account-section google-clever-explanation">
        <div className="google-clever-explanation header">
          <h4>Why can't I edit my account information?</h4>
          <img alt="lightbulb" src={`${process.env.CDN_URL}/images/illustrations/bulb.svg`} />
        </div>
        <p className="google-clever-explanation text">{`Your information is linked to your ${accountType} account. Go to your ${accountType} account settings to change your name, username, email or password.`}</p>
      </div>
    );
  }

  updateUser = (data, url, snackbarCopy, errors) => {
    if(!_.isEmpty(errors)) {
      this.setState({ errors: errors });
    } else {
      const { timesSubmitted } = this.state;
      request.put({
        url: `${process.env.DEFAULT_URL}${url}`,
        json: { ...data, authenticity_token: getAuthToken(), },
      }, (error, httpStatus, body) => {
        if (httpStatus && httpStatus.statusCode === 200) {
          const {
            name,
            username,
            email
          } = body.user;
          this.setState({
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1],
            userName: username,
            email,
            snackbarCopy,
            errors: {}
          }, () => {
            this.showSnackbar();
            this.setState({ activeSection: null });
          });
        } else if (body.errors) {
          // combine errors from front and backend error handling
          let errorsObject = body.errors;
          if(errors) {
            errorsObject.firstName = errors.firstName;
            errorsObject.lastName = errors.lastName;
            errorsObject.username ? errorsObject.username : errors.username;
          }
          this.setState({ errors: errorsObject, timesSubmitted: timesSubmitted + 1, });
        }
      });
    }
  }

  render() {
    const { firstName, lastName, userName, email, timesSubmitted, activeSection, errors } = this.state;
    const { googleId, cleverId, accountType, role } = this.props;
    return(
      <div className="user-account">
        {(cleverId || googleId) && this.renderExplanation()}
        <StudentGeneralAccountInfo
          accountType={accountType}
          active={activeSection === 'general'}
          activateSection={() => this.activateSection('general')}
          cleverId={cleverId}
          deactivateSection={() => this.deactivateSection('general')}
          email={email}
          errors={errors}
          firstName={firstName} 
          googleId={googleId}
          lastName={lastName} 
          timesSubmitted={timesSubmitted}
          updateUser={this.updateUser}
          userName={userName} 
        />
        <StudentPasswordAccountInfo
          activateSection={() => this.activateSection('password')}
          active={activeSection === 'password'}
          cleverId={cleverId}
          deactivateSection={() => this.deactivateSection('password')}
          errors={errors}
          googleId={googleId}
          role={role}
          timesSubmitted={timesSubmitted}
          updateUser={this.updateUser}
        />
        {(cleverId || googleId) && this.renderLinkedAccount()}
        {this.renderSnackbar()}
      </div>
    );
  }
}
