import React from 'react';

import { DropdownInput, informationIcon, } from '../../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const TeacherEmailNotifications = ({ activateSection, active, deactivateSection, resetTeacherNotificationSection, setTeacherNotificationOption, notificationEmailFrequency, notificationSettings, sendNewsletter, updateUser, updateNotificationSettings, updateTeacherInfo }) => {

  React.useEffect(() => {
    if (active) { return }

    resetTeacherNotificationSection()
  }, [active])

  React.useEffect(() => {
    if (!Object.values(notificationSettings).some(v => v === true)) { return }
    if (notificationEmailFrequency !== 'never') { return }

    updateNotificationEmailFrequency({value: 'daily'})
  }, [notificationSettings])

  React.useEffect(() => {
    if (notificationEmailFrequency !== 'never') { return }

    unsetAllNotificationSettings()
  }, [notificationEmailFrequency])

  function resetAndDeactivateSection() {
    resetTeacherNotificationSection()
    deactivateSection()
  }

  function toggleSendNewsletter() {
    setTeacherNotificationOption("tempSendNewsletter", !sendNewsletter)
  };

  function toggleNotificationSetting(setting) {
    setTeacherNotificationOption("tempTeacherNotificationSettings",
      {
        ...notificationSettings,
        ...{ [setting]: !notificationSettings[setting] }
      }
    )
  }

  function updateNotificationEmailFrequency(e) {
    setTeacherNotificationOption("tempNotificationEmailFrequency", e.value)
  }

  function unsetAllNotificationSettings() {
    Object.keys(notificationSettings).forEach(k => notificationSettings[k] = false)

    setTeacherNotificationOption("tempTeacherNotificationSettings", notificationSettings)
  }

  function handleSubmit(e) {
    e?.preventDefault()

    updateUser({
      send_newsletter: sendNewsletter,
      school_options_do_not_apply: true,
    }, '/teachers/update_my_account', 'Settings saved')

    updateNotificationSettings({
      notification_types: notificationSettings
    })

    updateTeacherInfo({
      notification_email_frequency: notificationEmailFrequency
    })
  }

  function renderNewsletterCheckbox() {
    const selectedClass = sendNewsletter ? "selected" : "unselected"
    const checkboxImg = sendNewsletter ? <img alt="check" src={smallWhiteCheckSrc} /> : ""

    return (
      <div className="checkbox-row">
        <div className={`quill-checkbox ${selectedClass}`} onClick={toggleSendNewsletter}>{checkboxImg}</div>
        <span>Bi-weekly newsletter</span>
      </div>
    )
  }

  function renderStudentEventCheckboxes() {
    const notificationSettingsToLabels = {
      "TeacherNotifications::StudentCompletedDiagnostic": "Student completed diagnostic",
      "TeacherNotifications::StudentCompletedAllDiagnosticRecommendations": "Student completed all diagnostic recommendations",
      "TeacherNotifications::StudentCompletedAllAssignedActivities": "Student completed all assigned activities"
    }

    return Object.entries(notificationSettings).map((entry) => {
      const [setting, value] = entry

      const selectedClass = (value) ? "selected" : "unselected"
      const checkboxImg = (value) ? (<img alt="check" src={smallWhiteCheckSrc} />) : ""

      return (
        <div className="checkbox-row">
          <div className={`quill-checkbox ${selectedClass}`} onClick={() => toggleNotificationSetting(setting)}>{checkboxImg}</div>
          <span>{notificationSettingsToLabels[setting]}</span>
        </div>
      )
    })
  }

  function renderNotificationEmailFrequencyDropdown() {
    const options = [
      { value: 'never', label: 'Never' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' }
    ]

    const selectedOption = options.find((option) => option.value === notificationEmailFrequency)

    return (
      <div>
        <DropdownInput
          handleChange={updateNotificationEmailFrequency}
          label="Frequency"
          options={options}
          value={selectedOption}
        />
        <p>
          <img alt={informationIcon.alt} src={informationIcon.src} />
          You will only receive a notification email if an event occurs.
        </p>
      </div>
    )
  }

  function renderButtonSection() {
    if (!active) { return }

    return (
      <div className="button-section">
        <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={resetAndDeactivateSection} type="button">Cancel</button>
        <input aria-label="Save changes" className="quill-button primary contained medium focus-on-light" type="submit" value="Save changes" />
      </div>
    )
  }

  return (
    <div className="teacher-account-email-notifications user-account-section">
      <h1>Email preferences</h1>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit}>
        <div className="fields" onClick={activateSection} onKeyDown={activateSection}>
          <h2>Newsletters</h2>
          <div className="checkboxes">
            {renderNewsletterCheckbox()}
          </div>
          <h2>Notifications</h2>
          <div className="checkboxes">
            {renderStudentEventCheckboxes()}
          </div>
          <h2>Notification frequency</h2>
          {renderNotificationEmailFrequencyDropdown()}
        </div>
        {renderButtonSection()}
      </form>
    </div>
  )
}

export default TeacherEmailNotifications
