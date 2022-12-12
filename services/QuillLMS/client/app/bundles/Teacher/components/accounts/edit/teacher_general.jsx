import React from 'react';

import { timeZoneOptions, } from './shared'

import SchoolSelector from '../../shared/school_selector'
import { Input, DropdownInput, } from '../../../../Shared/index'
import { requestPost, } from '../../../../../modules/request'

const HOME_SCHOOL_SCHOOL_NAME = 'home school'
const US_HIGHER_ED_SCHOOL_NAME = 'us higher ed'
const INTERNATIONAL_SCHOOL_NAME = 'international'
const NOT_LISTED_SCHOOL_NAME = 'not listed'
const NO_SCHOOL_SELECTED_SCHOOL_NAME = 'no school selected'
const OTHER_SCHOOL_NAME = 'other'
const US_K12_SCHOOL = 'U.S. K-12 school'

export default class TeacherGeneralAccountInfo extends React.Component {
  constructor(props) {
    super(props)

    const { name, email, timeZone, school, schoolType, showDismissSchoolSelectionReminderCheckbox, } = props

    this.state = {
      name,
      email,
      school,
      timeZone,
      schoolType,
      showSchoolSelector: false,
      showButtonSection: false,
      changedSchools: false,
      schoolSelectionReminderVisible: showDismissSchoolSelectionReminderCheckbox
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  activateSection = () => {
    if (!this.props.active || !this.state.showButtonSection) {
      this.setState({ showButtonSection: true, })
      this.props.activateSection()
    }
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value, });
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value, });
  };

  handleDismissSchoolSelectionReminder = () => {
    requestPost('/milestones/complete_dismiss_school_selection_reminder')
    this.setState({ schoolSelectionReminderVisible: false, })
  }

  handleSchoolChange = (id, schoolObj) => {
    const { school } = this.state
    const { alternativeSchools, } = this.props
    if (id !== school.id) {
      this.setState({ changedSchools: true, })
      if ([NOT_LISTED_SCHOOL_NAME, NO_SCHOOL_SELECTED_SCHOOL_NAME].includes(id)) {
        const alternativeSchool = alternativeSchools.find(school => school.name === id)
        this.setState({ school: alternativeSchool, showSchoolSelector: false, }, () => this.handleSubmit())
      } else {
        const school = { name: schoolObj.attributes.text, id, }
        this.setState({ school, showSchoolSelector: false, })
      }
    }
  };

  handleSchoolTypeChange = schoolType => {
    // we don't want teachers to set their school as "not-listed" if they already have a school selected
    if (schoolType.value !== US_K12_SCHOOL || this.state.schoolType !== US_K12_SCHOOL) {
      this.setState({ schoolType: schoolType.value, school: schoolType, changedSchools: true});
    }
  };

  handleSubmit = (e) => {
    const { name, email, timeZone, school, changedSchools } = this.state
    e?.preventDefault()
    const data = {
      name,
      email,
      time_zone: timeZone,
      school_id: school.id,
      school_options_do_not_apply: !changedSchools
    };
    this.props.updateUser(data, '/teachers/update_my_account', 'Settings saved')
  };

  handleTimezoneChange = timeZone => {
    this.setState({ timeZone: timeZone.name, });
  };

  reset = () => {
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
  };

  resetAndDeactivateSection = () => {
    this.reset()
    this.props.deactivateSection()
  };

  schoolTypeOptions = () => {
    const { alternativeSchoolsNameMap, } = this.props
    return [...new Set(Object.values(alternativeSchoolsNameMap))].map(schoolType => ({ label: schoolType, value: schoolType, }))
  };

  showSchoolSelector = () => {
    this.activateSection()
    this.setState({ showSchoolSelector: true, })
  };

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

  renderButtonSection() {
    if (this.state.showButtonSection) {
      return (
        <div className="button-section">
          <div className="quill-button outlined secondary medium" id="cancel" onClick={this.resetAndDeactivateSection}>Cancel</div>
          <input className={this.submitClass()} name="commit" type="submit" value="Save changes" />
        </div>
      )
    }
  }

  renderEmail() {
    const { googleId, cleverId, timesSubmitted, errors, } = this.props
    const { email, } = this.state
    if (googleId) {
      return (
        <Input
          className="email google-or-clever"
          disabled={true}
          helperText="Unlink your Google account below to change your email."
          label="Email"
          type="text"
          value={email}
        />
      )
    } else if (cleverId) {
      return (
        <Input
          className="email google-or-clever"
          disabled={true}
          helperText="Unlink your Clever account below to change your email."
          label="Email"
          type="text"
          value={email}
        />
      )
    } else {
      return (
        <Input
          className="email"
          error={errors.email}
          handleChange={this.handleEmailChange}
          label="Email"
          onClick={this.activateSection}
          timesSubmitted={timesSubmitted}
          type='text'
          value={email}
        />
      )
    }
  }

  renderSchool() {
    const { schoolType, showSchoolSelector, school, schoolSelectionReminderVisible, } = this.state
    if (schoolType === "U.S. K-12 school") {
      if (showSchoolSelector) {
        return (
          <SchoolSelector
            handleDismissSchoolSelectionReminder={this.handleDismissSchoolSelectionReminder}
            selectSchool={this.handleSchoolChange}
            showDismissSchoolSelectionReminderCheckbox={schoolSelectionReminderVisible}
          />
        )
      } else {
        let schoolNameValue = school && school.name ? school.name : ''
        let buttonCopy = 'Change school'
        if (schoolNameValue === NOT_LISTED_SCHOOL_NAME) {
          schoolNameValue = 'Not listed'
        } else if ([HOME_SCHOOL_SCHOOL_NAME, US_HIGHER_ED_SCHOOL_NAME, INTERNATIONAL_SCHOOL_NAME, OTHER_SCHOOL_NAME, NO_SCHOOL_SELECTED_SCHOOL_NAME].includes(schoolNameValue)) {
          schoolNameValue = 'No school selected'
          buttonCopy = 'Select school'
        }
        let schoolContainerClass = "school-container"
        schoolContainerClass += schoolSelectionReminderVisible && (!school || school.name === NO_SCHOOL_SELECTED_SCHOOL_NAME) ? ' show-notification-badges' : ''
        return (
          <div className={schoolContainerClass}>
            <Input
              className="school"
              disabled={true}
              label="School"
              type="text"
              value={schoolNameValue}
            />
            <button className="change-school notification-badge-relative interactive-wrapper" onClick={this.showSchoolSelector} type="button">{buttonCopy}</button>
          </div>
        )
      }
    }
  }

  render() {
    const { name, timeZone, schoolType, } = this.state
    const { errors, timesSubmitted, } = this.props
    const selectedTimeZone = timeZoneOptions.find(tz => tz.name === timeZone)
    const selectedSchoolType = this.schoolTypeOptions().find(st => st.value === schoolType)

    return (
      <div className="user-account-general user-account-section">
        <h1>General</h1>
        <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
          <div className="fields">
            <Input
              className="name"
              error={errors.name}
              handleChange={this.handleNameChange}
              label="Full name"
              onClick={this.activateSection}
              timesSubmitted={timesSubmitted}
              type="text"
              value={name}
            />
            {this.renderEmail()}
            <DropdownInput
              error={errors.timeZone}
              handleChange={this.handleTimezoneChange}
              label="Time zone"
              onClick={this.activateSection}
              options={timeZoneOptions}
              value={selectedTimeZone}
            />
            <DropdownInput
              error={errors.schoolType}
              handleChange={this.handleSchoolTypeChange}
              label="School type"
              onClick={this.activateSection}
              options={this.schoolTypeOptions()}
              value={selectedSchoolType}
            />
            {this.renderSchool()}
          </div>
          {this.renderButtonSection()}
        </form>
      </div>
    )
  }
}
