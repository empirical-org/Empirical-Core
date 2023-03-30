import * as React from 'react';

import SkipForNow from './skip_for_now'

import { Input, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const schoolVerificationSrc = `${process.env.CDN_URL}/images/onboarding/school_verification.svg`

const SchoolVerificationForm = ({ schoolName, }) => {
  const [verificationUrl, setVerificationUrl] = React.useState(null)
  const [verificationReason, setVerificationReason] = React.useState(null)

  function submitAdminInfo() {
    requestPut(
      `${process.env.DEFAULT_URL}/admin_infos`,
      {
        verification_url: verificationUrl,
        verification_reason: verificationReason
      },
      (body) => {
        window.location = '/finish_sign_up'
      }
    )
  }

  function onChangeVerificationUrl(e) {
    setVerificationUrl(e.target.value)
  }

  function onChangeVerificationReason(e) {
    setVerificationReason(e.target.value)
  }

  const submitButtonClassName = "quill-button primary contained medium focus-on-light"
  let submitButton = <button className={`${submitButtonClassName} disabled`} disabled type="button">Submit</button>

  if (verificationUrl && verificationReason) {
    submitButton = <button className={submitButtonClassName} onClick={submitAdminInfo} type="button">Submit</button>
  }

  return (
    <React.Fragment>
      <img alt="" src={schoolVerificationSrc} />
      <h1><span>Please verify your connection to:</span><span className="school-name">{schoolName}</span></h1>
      <p className="sub-header">Quill is committed to securing the privacy of districts, schools, teachers, and students. Complete the form below to ensure we are providing you with the appropriate access.</p>
      <section className="user-account-section school-verification-section">
        <h3>Please provide the URL of your LinkedIn profile</h3>
        <Input
          handleChange={onChangeVerificationUrl}
          helperText={`If you do not have a LinkedIn profile, please provide a link to another website that demonstrates your connection to ${schoolName}.`}
          placeholder="Enter URL"
          showPlaceholderWhenInactive={true}
          value={verificationUrl}
        />
        <h3>Why do you want to be an admin for {schoolName}?</h3>
        <Input
          handleChange={onChangeVerificationReason}
          placeholder="Type an answer"
          showPlaceholderWhenInactive={true}
          value={verificationReason}
        />
      </section>
      <div className="button-wrapper">
        {submitButton}
      </div>
      <SkipForNow />
    </React.Fragment>
  )
}

export default SchoolVerificationForm
