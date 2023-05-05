import React from 'react';

import { DropdownInput, } from '../../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const TeacherEmailNotifications = ({ activateSection, active, deactivateSection, passedSendNewsletter, passedNotificationSettings, passedNotificationEmailFrequency, updateUser, updateNotificationSettings, updateTeacherInfo }) => {

  const [sendNewsletter, setSendNewsletter] = React.useState(passedSendNewsletter)
  const [notificationSettings, setNotificationSettings] = React.useState(passedNotificationSettings)
  const [notificationEmailFrequency, setNotificationEmailFrequency] = React.useState(passedNotificationEmailFrequency)

  React.useEffect(() => {
    if (active) { return }

    reset()
  }, [active])

  // The following three useEffect calls should be unnecesary, but I was finding
  // in testing that during render cycles where "passed" values updated, the useState
  // calls weren't updating, so the UI would revert to the original state until refresh.
  // I suspect that it might be because the save call makes three separate API calls,
  // but at least adding these hooks makes things work.
  React.useEffect(() => {
    setSendNewsletter(passedSendNewsletter)
  }, [passedSendNewsletter])

  React.useEffect(() => {
    setNotificationSettings(passedNotificationSettings)
  }, [passedNotificationSettings])

  React.useEffect(() => {
    setNotificationEmailFrequency(passedNotificationEmailFrequency)
  }, [passedNotificationEmailFrequency])

  function reset() {
    setSendNewsletter(passedSendNewsletter)
    setNotificationSettings(passedNotificationSettings)
    setNotificationEmailFrequency(passedNotificationEmailFrequency)
  }

  function resetAndDeactivateSection() {
    reset()
    deactivateSection()
  }

  function toggleSendNewsletter() {
    setSendNewsletter(!sendNewsletter)
  };

  function toggleNotificationSetting(setting) {
    setNotificationSettings({
      ...notificationSettings,
      ...{ [setting]: !notificationSettings[setting] }
    })
  }

  function updateNotificationEmailFrequency(e) {
    setNotificationEmailFrequency(e.value)
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
    const selectedClass = (sendNewsletter) ? "selected" : "unselected"
    const checkboxImg = (sendNewsletter) ? (<img alt="check" src={smallWhiteCheckSrc} />) : ""

    return (
      <div className="checkbox-row">
        <div className={`quill-checkbox ${selectedClass}`} onClick={toggleSendNewsletter}>{checkboxImg}</div>
        <span>Receive bi-weekly newsletter (every two weeks)</span>
      </div>
    )
  }

  function renderStudentEventCheckboxes() {
    const notificationSettingsToLabels = {
      "TeacherNotifications::StudentCompletedDiagnostic": "Completed diagnostic",
      "TeacherNotifications::StudentCompletedAllDiagnosticRecommendations": "Completed all diagnostic recommendations",
      "TeacherNotifications::StudentCompletedAllAssignedActivities": "Completed all assigned activities"
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
      { value: 'daily', "label": 'Daily' },
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
        <p>You will only receive an email if an event occurs.</p>
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
      <h1>Email notifications</h1>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit}>
        <div className="fields" onClick={activateSection} onKeyDown={activateSection}>
          <div className="checkboxes">
            <h2>Newsletters</h2>
            {renderNewsletterCheckbox()}
            <h2>Student events</h2>
            {renderStudentEventCheckboxes()}
          </div>
          <h2>Email frequency</h2>
          {renderNotificationEmailFrequencyDropdown()}
        </div>
        {renderButtonSection()}
      </form>
    </div>
  )
}

export default TeacherEmailNotifications
