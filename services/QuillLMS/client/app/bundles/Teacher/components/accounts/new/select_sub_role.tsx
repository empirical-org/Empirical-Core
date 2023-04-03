import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { DropdownInput, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const networkSrc = `${process.env.CDN_URL}/images/onboarding/network.svg`
const districtAdminWarningIconSrc = `${process.env.CDN_URL}/images/onboarding/district-admin-warning-icon.svg`

const DISTRICT_ADMINISTRATOR = 'District administrator'

const SelectSubRole = ({ subRoles, }) => {
  const [subRole, setSubRole] = React.useState(null)

  function setSelectedSubRole(option) {
    setSubRole(option.value)
  }

  function submitAdminInfo() {
    requestPut(
      `${process.env.DEFAULT_URL}/admin_infos`,
      {
        sub_role: subRole
      },
      (body) => {
        window.location = '/sign-up/add-k12'
      }
    )
  }

  const nextButtonClassName = "quill-button primary contained medium focus-on-light"
  let nextButton = <button className={`${nextButtonClassName} disabled`} disabled type="button">Next</button>
  let districtAdminNote

  if (subRole) {
    nextButton = <button className={nextButtonClassName} onClick={submitAdminInfo} type="button">Next</button>
  }

  if (subRole === DISTRICT_ADMINISTRATOR) {
    districtAdminNote = (
      <section className="district-admin-note">
        <img alt="" src={districtAdminWarningIconSrc} />
        <p>Thanks for indicating that you are a District Administrator. Currently, you can only sign up as an administrator of <b>one</b> school. Once approved, you will receive an email regarding how to become an administrator of all schools in your district.</p>
      </section>
    )
  }

  const options = subRoles.map(sr => ({ value: sr, label: sr, }))
  const selectedOption = options.find(opt => opt.value === subRole)

  return (
    <div>
      <AssignActivityPackBanner />
      <div className="container account-form add-admin-info">
        <img alt="" src={networkSrc} />
        <h1>Please select your role</h1>
        <p className="sub-header">This will help us to better understand your needs. As an admin, you can still create classes and assignments.</p>
        <section className="user-account-section sub-role-section">
          <h2>Your role</h2>
          <DropdownInput
            handleChange={setSelectedSubRole}
            options={options}
            placeholder="Select a role"
            value={selectedOption}
          />
        </section>
        {districtAdminNote}
        <div className="button-wrapper">
          {nextButton}
        </div>
      </div>
    </div>
  )
}

export default SelectSubRole
