import React from 'react';
import {
  Input,
  DropdownInput
} from 'quill-component-library/dist/componentLibrary'

import SchoolSelector from '../../shared/school_selector'
import timezones from '../../../../../modules/timezones'

const timeZoneOptions = timezones.map((tz) => {
  const newTz = tz
  newTz.label = `(GMT${tz.offset}) ${tz.label}`
  return newTz
}).concat({ label: 'None selected', value: null, name: null, })

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
      showSchoolSelector: false,
      showButtonSection: false
    }

    this.activateSection = this.activateSection.bind(this)
    this.showSchoolSelector = this.showSchoolSelector.bind(this)
    this.handleSchoolChange = this.handleSchoolChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this)
    this.handleSchoolTypeChange = this.handleSchoolTypeChange.bind(this)
    this.resetAndDeactivateSection = this.resetAndDeactivateSection.bind(this)
    this.schoolTypeOptions = this.schoolTypeOptions.bind(this)
    this.reset = this.reset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { active, email, name, school, timeZone, schoolType, } = nextProps

    if (this.props.active && !active) {
      this.reset()
    }

    if (email !== this.props.email
      || name !== this.props.name
      || school !== this.props.school
      || timeZone !== this.props.timeZone
      || schoolType !== this.props.schoolType
    ) {
      this.setState({
        email,
        name,
        school,
        timeZone,
        schoolType
      })
    }
  }

  activateSection() {
    if (!this.props.active || !this.state.showButtonSection) {
      this.setState({ showButtonSection: true, })
      this.props.activateSection()
    }
  }

  handleSubmit(e) {
    const { name, email, timeZone, school } = this.state
    e.preventDefault()
    const data = {
      name,
      email,
      time_zone: timeZone,
      school_id: school.id
    };
    this.props.updateUser(data, '/teachers/update_my_account', 'Settings saved')
  }

  showSchoolSelector() {
    this.activateSection()
    this.setState({ showSchoolSelector: true, })
  }

  handleSchoolChange(id, schoolObj) {
    if (id === 'not listed') {
      const notListedSchool = this.props.alternativeSchools.find(school => school.name === 'not listed')
      this.setState({ school: notListedSchool, showSchoolSelector: false, })
    } else {
      const school = { name: schoolObj.attributes.text, id, }
      this.setState({ school, showSchoolSelector: false, })
    }
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value, });
  }

  handleTimezoneChange(timeZone) {
    this.setState({ timeZone: timeZone.name, });
  }

  handleSchoolTypeChange(schoolType) {
    // we don't want teachers to set their school as "not-listed" if they already have a school selected
    if (schoolType.value !== 'U.S. K-12 school' || this.state.schoolType !== 'U.S. K-12 school') {
      this.setState({ schoolType: schoolType.value, school: schoolType, });
    }
  }

  reset() {
    const { email, name, timeZone, school, schoolType, } = this.props
    this.setState({
      name,
      email,
      timeZone,
      school,
      schoolType,
      showSchoolSelector: false,
      showButtonSection: false
    })
  }

  schoolTypeOptions() {
    const { alternativeSchools, alternativeSchoolsNameMap, } = this.props
    return alternativeSchools.map((school) => {
      const schoolOption = school
      schoolOption.label = alternativeSchoolsNameMap[school.name]
      schoolOption.value = alternativeSchoolsNameMap[school.name]
      return schoolOption
    })
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
    const { googleId, cleverId, timesSubmitted, errors, } = this.props
    const { email, } = this.state
    if (googleId) {
      return (<Input
        label="Email"
        value={email}
        type="text"
        className="email google-or-clever"
        disabled={true}
        helperText={'Unlink your Google account below to change your email.'}
      />)
    } else if (cleverId) {
      return (<Input
        label="Email"
        value={email}
        type="text"
        className="email google-or-clever"
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
        onClick={this.activateSection}
      />)
    }
  }

  renderSchool() {
    const { schoolType, showSchoolSelector, school, } = this.state
    if (schoolType === "U.S. K-12 school") {
      if (showSchoolSelector) {
        return <SchoolSelector selectSchool={this.handleSchoolChange} />
      } else {
        const schoolName = school && school.name ? school.name : ''
        const schoolNameValue = ['home school', 'us higher ed', 'international', 'other', 'not listed'].includes(schoolName) ? 'Not listed' : schoolName
        return (
          <div className="school-container">
            <Input
              label="School"
              value={schoolNameValue}
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

  resetAndDeactivateSection() {
    this.reset()
    this.props.deactivateSection()
  }

  renderButtonSection() {
    if (this.state.showButtonSection) {
      return <div className="button-section">
        <div id="cancel" className="quill-button outlined secondary medium" onClick={this.resetAndDeactivateSection}>Cancel</div>
        <input type="submit" name="commit" value="Save changes" className={this.submitClass()} />
      </div>
    }
  }

  render() {
    const { name, timeZone, schoolType, } = this.state
    const { errors, timesSubmitted, } = this.props
    const selectedTimeZone = timeZoneOptions.find(tz => tz.name === timeZone)
    const selectedSchoolType = this.schoolTypeOptions().find(st => st.value === schoolType)

    return <div className="teacher-account-general teacher-account-section">
      <h1>General</h1>
      <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
        <div className="fields">
          <Input
            label="Full name"
            value={name}
            handleChange={this.handleNameChange}
            type="text"
            className="name"
            error={errors.name}
            timesSubmitted={timesSubmitted}
            onClick={this.activateSection}
          />
          {this.renderEmail()}
          <DropdownInput
            label="Time zone"
            value={selectedTimeZone}
            options={timeZoneOptions}
            handleChange={this.handleTimezoneChange}
            error={errors.timeZone}
            onClick={this.activateSection}
          />
          <DropdownInput
            label="School type"
            value={selectedSchoolType}
            options={this.schoolTypeOptions()}
            handleChange={this.handleSchoolTypeChange}
            error={errors.schoolType}
            onClick={this.activateSection}
          />
          {this.renderSchool()}
        </div>
        {this.renderButtonSection()}
      </form>
    </div>
  }
}
