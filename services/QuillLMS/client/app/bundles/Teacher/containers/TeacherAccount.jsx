import React from 'react';
import request from 'request';
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'
import TeacherPasswordAccountInfo from '../components/accounts/edit/teacher_password'
import TeacherLinkedAccounts from '../components/accounts/edit/teacher_linked_accounts'
import TeacherEmailNotifications from '../components/accounts/edit/teacher_email_notifications'
import TeacherDangerZone from '../components/accounts/edit/teacher_danger_zone'
import getAuthToken from '../components/modules/get_auth_token'

export default class TeacherAccount extends React.Component {
  constructor(props) {
    super(props)

    const {
      name,
      email,
      clever_id,
      google_id,
      time_zone,
      school,
      school_type,
      send_newsletter,
      post_google_classroom_assignments,
    } = props.accountInfo
    this.state = {
      activeSection: null,
      name,
      email,
      timeZone: time_zone,
      school,
      schoolType: school_type,
      googleId: google_id,
      cleverId: clever_id,
      sendNewsletter: send_newsletter,
      postGoogleClassroomAssignments: post_google_classroom_assignments,
      snackbarCopy: '',
      showSnackbar: false,
      errors: {},
      timesSubmitted: 0
    }

    this.activateSection = this.activateSection.bind(this)
    this.deactivateSection = this.deactivateSection.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.renderSnackbar = this.renderSnackbar.bind(this)
  }

  componentWillMount() {
    let snackbarCopy
    const { googleOrCleverJustSet, accountInfo, } = this.props
    if (googleOrCleverJustSet) {
      if (accountInfo.google_id) {
        snackbarCopy = 'Google linked'
      }
      if (accountInfo.clever_id) {
        snackbarCopy = 'Clever linked'
      }
      this.setState({ snackbarCopy, }, this.showSnackbar)
    }
  }

  activateSection(section) {
    this.setState({ activeSection: section, })
  }

  deactivateSection(section) {
    if (this.state.activeSection === section) {
      this.setState({ activeSection: null, errors: {}, })
    }
  }

  showSnackbar() {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  updateUser(data, url, snackbarCopy) {
    const { timesSubmitted, } = this.state
    request.put({
      url: `${process.env.DEFAULT_URL}${url}`,
      json: { ...data, authenticity_token: getAuthToken(), },
    }, (error, httpStatus, body) => {
      if (httpStatus && httpStatus.statusCode === 200) {
        const {
          name,
          email,
          clever_id,
          google_id,
          time_zone,
          school,
          school_type,
          send_newsletter,
          post_google_classroom_assignments,
        } = body
        this.setState({
          name,
          email,
          timeZone: time_zone,
          school,
          schoolType: school_type,
          googleId: google_id,
          cleverId: clever_id,
          sendNewsletter: send_newsletter,
          postGoogleClassroomAssignments: post_google_classroom_assignments,
          snackbarCopy,
          errors: {}
        }, () => {
          this.showSnackbar()
          this.setState({ activeSection: null, })
        })
      } else if (body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1, })
      }
    });
  }

  deleteAccount() {
    const { id, } = this.props.accountInfo
    request.post({
      url: `${process.env.DEFAULT_URL}/teachers/clear_data/${id}`,
      json: { authenticity_token: getAuthToken(), },
    }, () => {
      window.location.href = window.location.origin;
    })
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  render() {
    const {
      name,
      email,
      cleverId,
      googleId,
      timeZone,
      school,
      schoolType,
      errors,
      timesSubmitted,
      activeSection,
      sendNewsletter,
      postGoogleClassroomAssignments,
    } = this.state
    const { alternativeSchools, alternativeSchoolsNameMap, cleverLink, } = this.props
    return (<div className="teacher-account">
      <TeacherGeneralAccountInfo
        name={name}
        email={email}
        school={school}
        timeZone={timeZone}
        schoolType={schoolType}
        cleverId={cleverId}
        googleId={googleId}
        alternativeSchools={alternativeSchools}
        alternativeSchoolsNameMap={alternativeSchoolsNameMap}
        activateSection={() => this.activateSection('general')}
        deactivateSection={() => this.deactivateSection('general')}
        active={activeSection === 'general'}
        updateUser={this.updateUser}
        errors={errors}
        timesSubmitted={timesSubmitted}
      />
      <TeacherPasswordAccountInfo
        cleverId={cleverId}
        googleId={googleId}
        errors={errors}
        timesSubmitted={timesSubmitted}
        activateSection={() => this.activateSection('password')}
        deactivateSection={() => this.deactivateSection('password')}
        active={activeSection === 'password'}
        updateUser={this.updateUser}
      />
      <TeacherLinkedAccounts
        cleverId={cleverId}
        googleId={googleId}
        cleverLink={cleverLink}
        updateUser={this.updateUser}
        postGoogleClassroomAssignments={postGoogleClassroomAssignments}
        email={email}
        errors={errors}
        timesSubmitted={timesSubmitted}
      />
      <TeacherEmailNotifications
        updateUser={this.updateUser}
        sendNewsletter={sendNewsletter}
      />
      <TeacherDangerZone
        deleteAccount={this.deleteAccount}
      />
      {this.renderSnackbar()}
    </div>)
  }
}
