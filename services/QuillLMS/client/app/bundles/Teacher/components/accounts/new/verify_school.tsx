import * as React from 'react';

import SchoolVerificationForm from './school_verification_form'
import RequestAdminAccessForm from './request_admin_access_form'

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { Spinner, } from '../../../../Shared/index'
import { requestGet, } from '../../../../../modules/request/index'

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
    content = admins?.length && window.location.href.includes('show-admin-access-form') ? <RequestAdminAccessForm admins={admins} schoolName={schoolName} /> : <SchoolVerificationForm schoolName={schoolName} />
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
