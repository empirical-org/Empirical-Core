import * as React from 'react';

import RequestAdminAccessForm from './request_admin_access_form';
import SchoolVerificationForm from './school_verification_form';

import { requestGet, } from '../../../../../modules/request/index';
import { Spinner, } from '../../../../Shared/index';
import AssignActivityPackBanner from '../assignActivityPackBanner';

const VerifySchool = ({ passedSchoolName, passedAdmins, }) => {
  const [schoolName, setSchoolName] = React.useState(passedSchoolName || '')
  const [admins, setAdmins] = React.useState(passedAdmins || [])

  React.useEffect(getSchool, [])

  function getSchool() {
    requestGet(`${import.meta.env.VITE_DEFAULT_URL}/school_for_current_user`, (body) => {
      setSchoolName(body.school?.name)
      setAdmins(body.admins)
    })
  }

  let content = <Spinner />

  if (schoolName) {
    content = admins?.length ? <RequestAdminAccessForm admins={admins} schoolName={schoolName} /> : <SchoolVerificationForm schoolName={schoolName} />
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
