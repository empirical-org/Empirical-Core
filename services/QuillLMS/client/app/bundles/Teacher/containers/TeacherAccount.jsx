import React from 'react';
import request from 'request';
import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'
import TeacherPasswordAccountInfo from '../components/accounts/edit/teacher_password'
import Snackbar from '../components/shared/snackbar'
import getAuthToken from '../components/modules/get_auth_token'

export default class TeacherAccount extends React.Component {
  constructor(props) {
    super(props)

    const { name, email, clever_id, google_id, time_zone, school, school_type } = props.accountInfo
    this.state = {
      activeSection: null,
      name,
      email,
      timeZone: time_zone,
      school,
      schoolType: school_type,
      googleId: google_id,
      cleverId: clever_id,
      snackbarCopy: '',
      showSnackbar: false,
      errors: {},
      timesSubmitted: 0
    }

    this.activateSection = this.activateSection.bind(this)
    this.deactivateSection = this.deactivateSection.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.renderSnackbar = this.renderSnackbar.bind(this)
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
      setTimeout(() => this.setState({ showSnackbar: false, }), 7000)
    })
  }

  updateUser(data) {
    const { timesSubmitted, } = this.state
    request.put({
      url: `${process.env.DEFAULT_URL}/teachers/update_my_account`,
      json: { ...data, authenticity_token: getAuthToken(), },
    }, (error, httpStatus, body) => {
      if (httpStatus && httpStatus.statusCode === 200) {
        const { name, email, clever_id, google_id, time_zone, school, school_type, } = body
        this.setState({
          name,
          email,
          timeZone: time_zone,
          school,
          schoolType: school_type,
          googleId: google_id,
          cleverId: clever_id,
          snackbarCopy: 'Settings saved'
        }, () => {
          this.showSnackbar()
          this.setState({ activeSection: null, })
        })
      } else if (body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1, })
      }
    });
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  render() {
    const { name, email, cleverId, googleId, timeZone, school, schoolType, errors, timesSubmitted, } = this.state
    return (<div className="teacher-account">
      <TeacherGeneralAccountInfo
        name={name}
        email={email}
        school={school}
        timeZone={timeZone}
        schoolType={schoolType}
        cleverId={cleverId}
        googleId={googleId}
        alternativeSchools={this.props.alternativeSchools}
        alternativeSchoolsNameMap={this.props.alternativeSchoolsNameMap}
        activateSection={() => this.activateSection('general')}
        deactivateSection={() => this.deactivateSection('general')}
        active={this.state.activeSection === 'general'}
        updateUser={this.updateUser}
        errors={errors}
        timesSubmitted={timesSubmitted}
      />
      <TeacherPasswordAccountInfo
        cleverId={cleverId}
        googleId={googleId}
        errors={errors}
        timesSubmitted={timesSubmitted}
      />
      {this.renderSnackbar()}
    </div>)
  }
}
