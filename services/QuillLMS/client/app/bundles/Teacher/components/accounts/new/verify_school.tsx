import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { Input, Spinner, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const schoolVerificationSrc = `${process.env.CDN_URL}/images/onboarding/school_verification.svg`

const VerifySchool = ({ }) => {
  const [schoolName, setSchoolName] = React.useState(null)
  const [verificationUrl, setVerificationUrl] = React.useState(null)
  const [verificationReason, setVerificationReason] = React.useState(null)

  function getSchool() {

  }

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

  const nextButtonClassName = "quill-button primary contained medium focus-on-light"
  let nextButton = <button className={`${nextButtonClassName} disabled`} disabled type="button">Next</button>

  if (verificationUrl && verificationReason) {
    nextButton = <button className={nextButtonClassName} onClick={submitAdminInfo} type="button">Next</button>
  }

  return (
    <div>
      <AssignActivityPackBanner />
      <div className="container account-form add-admin-info">
        <img alt="" src={schoolVerificationSrc} />
        <h1><span>Please verify your connection to:</span><span>{schoolName}</span></h1>
        <p className="sub-header">Quill is committed to securing the privacy of districts, schools, teachers, and students. Please complete the form below to ensure we are providing you with the appropriate access.</p>
        <section className="user-account-section school-verification-section">
          <h2>Please provide the URL of your LinkedIn profile</h2>
          <Input
            handleChange={setVerificationUrl}
            helperText={`If you do not have a LinkedIn profile, please provide a link to another website that demonstrates your connection to ${schoolName}.`}
            placeholder="Enter URL"
            value={verificationUrl}
          />
          <h2>Why do you want to be an admin for {schoolName}?</h2>
          <Input
            handleChange={setVerificationUrl}
            placeholder="Type answer"
            value={verificationUrl}
          />
        </section>
        <div className="button-wrapper">
          {nextButton}
        </div>
      </div>
    </div>
  )
}

export default VerifySchool
