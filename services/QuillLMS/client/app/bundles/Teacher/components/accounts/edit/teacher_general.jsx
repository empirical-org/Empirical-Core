import React from 'react';
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import SchoolSelector from '../../shared/school_selector'
import timezones from '../../../../../modules/timezones'

const schoolTypeOptions = ['U.S. K-12 school', 'Home school', 'International institution', 'U.S. higher education institution', 'Other'].map((type) => {
  return { label: type, value: type, }
})

export default class TeacherGeneralAccountInfo extends React.Component {
  constructor(props) {
    super(props)

    const { name, email, timeZone, school, schoolType, } = props

    this.state = {
      name,
      email,
      school,
      timeZone,
      schoolType,
      errors: {},
      timeSubmitted: 0,
      showSchoolSelector: false
    }

    this.showSchoolSelector = this.showSchoolSelector.bind(this)
    this.handleSchoolChange = this.handleSchoolChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this)
    this.handleSchoolTypeChange = this.handleSchoolTypeChange.bind(this)
  }

  showSchoolSelector() {
    this.setState({ showSchoolSelector: true, })
  }

  handleSchoolChange(id, school) {
    this.setState({ school, })
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, });
  }

  handleTimezoneChange(timeZone) {
    this.setState({ timeZone: timeZone.value, });
  }

  handleSchoolTypeChange(schoolType) {
    this.setState({ schoolType: schoolType.value, });
  }

  submitClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (this.state.name === this.props.name
      && this.state.email === this.props.email
      && this.state.timeZone === this.props.timeZone
      && this.state.schoolType === this.props.schoolType
      && this.state.school === this.props.school
    ) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  renderEmail() {
    const { googleId, cleverId, } = this.props
    const { email, timesSubmitted, errors, } = this.state
    if (googleId) {
      return (<Input
        label="Email"
        value={email}
        type="text"
        className="email"
        disabled={true}
        helperText={'Unlink your Google account below to change your email.'}
      />)
    } else if (cleverId) {
      return (<Input
        label="Email"
        value={email}
        type="text"
        className="email"
        disabled={true}
        helperText={'Unlink your Clever account below to change your email.'}
      />)
    } else {
      return (<Input
        label="Email"
        value={email}
        handleChange={this.handleEmailChange}
        type='text'
        className="email"
        error={errors.email}
        timesSubmitted={timesSubmitted}
      />)
    }
  }

  renderSchool() {
    const { schoolType, showSchoolSelector, school, } = this.state
    if (schoolType === "U.S. K-12 school") {
      if (showSchoolSelector) {
        return <SchoolSelector selectSchool={this.handleSchoolChange} />
      } else {
        return (
          <div className="school-container">
            <Input
              label="School"
              value={school.name}
              type="text"
              className="school"
              disabled={true}
            />
            <span className="change-school" onClick={this.showSchoolSelector}>Change school</span>
          </div>
        )
      }
    }
  }

  render() {
    const { name, timeZone, timesSubmitted, errors, schoolType, } = this.state
    const timeZoneOptions = timezones.map((tz) => {
      tz.label = `(GMT${tz.offset}) ${tz.label}`
      return tz
    }).concat({ label: 'None selected', value: null, })
    const selectedTimeZone = timeZoneOptions.find(tz => tz.value === timeZone)
    const selectedSchoolType = schoolTypeOptions.find(st => st.value === schoolType)

    return <div className="teacher-account-general teacher-account-section">
      <h1>General</h1>
      <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
        <Input
          label="Full name"
          value={name}
          handleChange={this.handleNameChange}
          type="text"
          className="name"
          error={errors.name}
          timesSubmitted={timesSubmitted}
        />
        {this.renderEmail()}
        <DropdownInput
          label="Time zone"
          value={selectedTimeZone}
          options={timeZoneOptions}
          handleChange={this.handleTimezoneChange}
          error={errors.timeZone}
        />
        <DropdownInput
          label="School type"
          value={selectedSchoolType}
          options={schoolTypeOptions}
          handleChange={this.handleSchoolTypeChange}
          error={errors.schoolType}
        />
        {this.renderSchool()}
        <input type="submit" name="commit" value="Log in" className={this.submitClass()} />
      </form>
    </div>
  }
}
