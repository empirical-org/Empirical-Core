import React, { Component } from 'react';
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary';
import StudentGeneralAccountInfo from '../components/accounts/edit/student_general.jsx';
import StudentPasswordAccountInfo from '../components/accounts/edit/update_password';
import getAuthToken from '../components/modules/get_auth_token';
import request from 'request';
import _ from 'lodash';

export default class StudentAccount extends Component {
  state = {
    firstName: this.props.name.split(' ')[0],
    lastName: this.props.name.split(' ')[1],
    userName: this.props.userName,
    email: this.props.email,
    snackbarCopy: '',
    activeSection: null,
    timesSubmitted: 0,
    errors: {}
  };

  activateSection = (section) => {
    this.setState({ activeSection: section, })
  }

  deactivateSection = (section) => {
    if (this.state.activeSection === section) {
      this.setState({ activeSection: null, errors: {} });
    }
  }

  showSnackbar() {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
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
    const { googleId, cleverId, signedUpWithGoogle, accountType, role } = this.props;
    return(
      <div className="teacher-account">
        <StudentGeneralAccountInfo
          firstName={firstName} 
          lastName={lastName} 
          userName={userName} 
          email={email}
          cleverId={cleverId}
          googleId={googleId}
          signedUpWithGoogle={signedUpWithGoogle}
          accountType={accountType}
          timesSubmitted={timesSubmitted}
          errors={errors}
          active={activeSection === 'general'}
          activateSection={() => this.activateSection('general')}
          deactivateSection={() => this.deactivateSection('general')}
          updateUser={this.updateUser}
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
        {this.renderSnackbar()}
      </div>
    );
  }
}
