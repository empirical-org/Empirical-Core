import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { DropdownInput, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const networkSrc = `${process.env.CDN_URL}/images/onboarding/network.svg`

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

  if (subRole) {
    nextButton = <button className={nextButtonClassName} onClick={submitAdminInfo} type="button">Next</button>
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
            value={selectedOption}
          />
        </section>
        <div className="button-wrapper">
          {nextButton}
        </div>
      </div>
    </div>
  )
}

export default SelectSubRole
