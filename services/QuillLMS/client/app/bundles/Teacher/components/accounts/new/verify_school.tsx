import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { Input, Spinner, } from '../../../../Shared/index'
import { requestPut, requestGet, } from '../../../../../modules/request/index'

const schoolVerificationSrc = `${process.env.CDN_URL}/images/onboarding/school_verification.svg`

const VerifySchool = ({ passedSchoolName, }) => {
  const [schoolName, setSchoolName] = React.useState(passedSchoolName)
  const [verificationUrl, setVerificationUrl] = React.useState(null)
  const [verificationReason, setVerificationReason] = React.useState(null)

  React.useEffect(getSchool, [])

  function getSchool() {
    requestGet(`${process.env.DEFAULT_URL}/school_for_current_user`, (body) => {
      setSchoolName(body.school?.name)
    })
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

  function onChangeVerificationUrl(e) {
    setVerificationUrl(e.target.value)
  }

  function onChangeVerificationReason(e) {
    setVerificationReason(e.target.value)
  }

  const nextButtonClassName = "quill-button primary contained medium focus-on-light"
  let nextButton = <button className={`${nextButtonClassName} disabled`} disabled type="button">Next</button>

  if (verificationUrl && verificationReason) {
    nextButton = <button className={nextButtonClassName} onClick={submitAdminInfo} type="button">Next</button>
  }

  let content = <Spinner />

  if (schoolName) {
    content = (
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
          {nextButton}
        </div>
      </React.Fragment>
    )
  }

  return (
    <div>
      <AssignActivityPackBanner />
      <div className="container account-form add-admin-info">
        {content}
      </div>
    </div>
  )
}

export default VerifySchool
