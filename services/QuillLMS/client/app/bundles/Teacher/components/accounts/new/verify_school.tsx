import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import AdminTable from '../../admin_access/adminTable'
import { Input, Spinner, } from '../../../../Shared/index'
import { requestPut, requestPost, requestGet, } from '../../../../../modules/request/index'

const schoolVerificationSrc = `${process.env.CDN_URL}/images/onboarding/school_verification.svg`

const SkipForNow = () => (<a className="skip-for-now" href="/finish_sign_up">Skip for now</a>)

const RequestAdminAccessForm = ({ schoolName, admins, }) => {
  const [selectedAdminIds, setSelectedAdminIds] = React.useState([])
  const [reason, setReason] = React.useState('')

  function handleChangeReason(e) { setReason(e.target.value) }

  function handleClickSubmit() {
    requestPost(`${process.env.DEFAULT_URL}/admin_access/new_user_requests_admin_access_from_existing_admins`, {
      admin_ids: selectedAdminIds,
      reason
    }, () => {
      window.location = '/finish_sign_up'
    })
  }

  const submitButtonClassName = "quill-button primary contained medium focus-on-light"
  let submitButton = <button className={`${submitButtonClassName} disabled`} disabled type="button">Submit</button>

  if (selectedAdminIds.length) {
    submitButton = <button className={submitButtonClassName} onClick={handleClickSubmit} type="button">Submit</button>
  }

  return (
    <React.Fragment>
      <img alt="" src={schoolVerificationSrc} />
      <h1><span>Please request permission to become an admin of:</span><span className="school-name">{schoolName}</span></h1>
      <p className="sub-header">Which admin(s) do you want to send the request to?</p>
      <section className="user-account-section admin-access-request-section">
        <AdminTable schoolAdmins={admins} selectedAdminIds={selectedAdminIds} setSelectedAdminIds={setSelectedAdminIds} />
        <Input
          className="reason"
          handleChange={handleChangeReason}
          label="Why do you want to be an admin?"
          value={reason}
        />
      </section>
      <div className="button-wrapper">
        {submitButton}
      </div>
      <SkipForNow />
    </React.Fragment>
  )
}

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

const VerifySchool = ({ passedSchoolName, passedAdmins, }) => {
  const [schoolName, setSchoolName] = React.useState(passedSchoolName || '')
  const [admins, setAdmins] = React.useState(passedAdmins || [])

  React.useEffect(getSchool, [])

  function getSchool() {
    requestGet(`${process.env.DEFAULT_URL}/school_for_current_user`, (body) => {
      setSchoolName(body.school?.name)
      setAdmins(body.admins)
    })
  }

  let content = <Spinner />

  if (schoolName) {
    content = admins.length ? <RequestAdminAccessForm admins={admins} schoolName={schoolName} /> : <SchoolVerificationForm schoolName={schoolName} />
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
