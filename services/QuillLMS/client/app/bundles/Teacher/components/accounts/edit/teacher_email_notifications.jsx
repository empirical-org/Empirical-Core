import React from 'react';

import { DropdownInput, } from '../../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

export default class TeacherEmailNotifications extends React.Component {
  toggleSendNewsletter = () => {
    const { sendNewsletter, updateUser, } = this.props
    const data = {
      send_newsletter: !sendNewsletter,
      school_options_do_not_apply: true
    };
    updateUser(data, '/teachers/update_my_account', 'Settings saved')
  };

  toggleNotificationSetting = (setting) => {
    const

  renderCheckbox() {
    const { sendNewsletter, } = this.props
    if (sendNewsletter) {
      return <div className="quill-checkbox selected" onClick={this.toggleSendNewsletter}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.toggleSendNewsletter} />
    }
  }

  renderStudentEventCheckboxes() {
    const { teacherNotificationSettings, } = this.props

    return Object.entries(teacherNotificationSettings).map((entry) => {
      const [setting, value] = entry

      if (value) {
        return (
          <div>
            <div className="quill-checkbox selected" onClick={this.toggleSendNewsletter}><img alt="check" src={smallWhiteCheckSrc} /></div>
            <span>{setting}</span>
          </div>
        )
      } else {
        return (
          <div>
            <div className="quill-checkbox unselected" onClick={this.toggleSendNewsletter} />
            <span>{setting}</span>
          </div>
        )
      }
    })
  }

  renderNotificationEmailFrequencyDropdown() {
    const { notificationEmailFrequency, } = this.props
    const options = [
      { value: 'never', label: 'Never' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' }
    ]


    return (
      <div>
        <DropdownInput
          label="Frequency"
          options={options}
          handleChange={(e) => {this.changeSavedValues('dropdownThree', e)}}
          value={notificationEmailFrequency}
          isSearchable={false}
          placeholder="Frequency"
        />
        <p>You will only receive an email if an event occurs.</p>
      </div>
    )
  }

  render() {
    return (
      <div className="teacher-account-email-notifications user-account-section">
        <h1>Email notifications</h1>
        <div className="checkboxes">
          <h2>Newsletters</h2>
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxOne')}
            <span>Receive bi-weekly newsletter (every two weeks)</span>
          </div>
          <h2>Student events</h2>
          {this.renderStudentEventCheckboxes()}
          {this.renderNotificationEmailFrequencyDropdown()}
        </div>
      </div>
    )
  }
}
