import React from 'react';
import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'

export default class TeacherAccount extends React.Component {
  constructor(props) {
    super(props)
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
      />
    </div>)
  }
}
