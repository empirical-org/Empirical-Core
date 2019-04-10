import React from 'react';
import request from 'request';
import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'
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
      errors: {},
      timesSubmitted: 0
    }

    this.activateSection = this.activateSection.bind(this)
    this.deactivateSection = this.deactivateSection.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  activateSection(section) {
    this.setState({ activeSection: section, })
  }

  deactivateSection(section) {
    if (this.state.activeSection === section) {
      this.setState({ activeSection: null, })
    }
  }

  updateUser(data) {
    const { timesSubmitted, } = this.state
    request.put({
      url: `${process.env.DEFAULT_URL}/teachers/update_my_account`,
      json: { ...data, authenticity_token: getAuthToken(), },
    }, (error, httpStatus, body) => {
      if (httpStatus && httpStatus.statusCode === 200) {
        debugger;
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
        }, () => this.setState({ activeSection: null, }))
      } else if (body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1, })
      }
    });
  }

  render() {
    const { name, email, cleverId, googleId, timeZone, school, schoolType, errors, } = this.state
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
      />
    </div>)
  }
}
