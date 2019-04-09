import React from 'react';
import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'

export default class TeacherAccount extends React.Component {
  constructor(props) {
    super(props)

    this.state = { activeSection: null }

    this.activateSection = this.activateSection.bind(this)
    this.deactivateSection = this.deactivateSection.bind(this)
  }

  activateSection(section) {
    this.setState({ activeSection: section, })
  }

  deactivateSection(section) {
    debugger;
    if (this.state.activeSection === section) {
      this.setState({ activeSection: null, })
    }
  }

  render() {
    const { name, email, clever_id, google_id, time_zone, school, school_type } = this.props.accountInfo
    return (<div className="teacher-account">
      <TeacherGeneralAccountInfo
        name={name}
        email={email}
        school={school}
        timeZone={time_zone}
        schoolType={school_type}
        cleverId={clever_id}
        googleId={google_id}
        activateSection={() => this.activateSection('general')}
        deactivateSection={() => this.deactivateSection('general')}
        active={this.state.activeSection === 'general'}
      />
    </div>)
  }
}
