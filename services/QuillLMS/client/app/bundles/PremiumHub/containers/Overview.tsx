import Pusher from 'pusher-js';
import React from 'react';

import { requestGet, } from '../../../modules/request/index';
import { Tooltip, Spinner, Snackbar, defaultSnackbarTimeout, } from '../../Shared/index';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor';
import LogInAsATeacherModal from '../components/overview/logInAsAsTeacherModal'
import HighlightsSection from '../components/overview/highlightsSection'
import ProfessionalDevelopmentSection from '../components/overview/professionalDevelopmentSection'
import AccountManagementSection from '../components/overview/accountManagementSection'
import IntegrationsSection from '../components/overview/integrationsSection'
import PremiumReportsSection from '../components/overview/premiumReportsSection'
import { FULL, RESTRICTED_TEXT, } from '../shared'

const Overview = ({ adminId, accessType, passedModel, adminInfo, }) => {
  const [loading, setLoading] = React.useState(passedModel ? false : true)
  const [model, setModel] = React.useState(passedModel || null)
  const [pusherChannel, setPusherChannel] = React.useState(null)
  const [showLoginAsTeacherModal, setShowLoginAsTeacherModal] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, cluster: process.env.PUSHER_CLUSTER });
    const channel = pusher.subscribe(String(adminId));
    setPusherChannel(channel)
  }, [])

  React.useEffect(() => {
    if (!pusherChannel) { return }

    bindToAdminUsersChannel()
    getData()
  }, [pusherChannel])

  React.useEffect(() => {
    if (model) {
      setLoading(false)
    }
  }, [model])

  function getData() {
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}`,
      (body) => {
        receiveData(body)
      }
    );
  }

  function receiveData(data) {
    if (Object.keys(data).length > 1) {
      setModel(data)
      setLoading(false)
    }
  };

  function bindToAdminUsersChannel() {
    if (!pusherChannel) { return }

    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    pusherChannel.bind('admin-users-found', () => {
      getData()
    });
  };

  function handleClickLogInAsATeacher() {
    if (accessType === FULL) {
      setShowLoginAsTeacherModal(true)
    } else {
      setSnackbarText(RESTRICTED_TEXT)
      setShowSnackbar(true)
    }
  }

  function closeLogInAsATeacherModal() { setShowLoginAsTeacherModal(false) }

  function renderSubheader() {
    if (adminInfo.schools.length === 0) {
      return (
        <p className="subheader">Thanks for being an admin. We’re excited to have you on board!</p>
      )
    }

    const sortedSchools = adminInfo.schools.sort((a, b) => a.name.localeCompare(b.name));

    const associatedSchoolIndex = sortedSchools.findIndex(school => school.id === adminInfo.associated_school?.id);

    if (associatedSchoolIndex > 0) {
      const [associatedSchool] = sortedSchools.splice(associatedSchoolIndex, 1);
      sortedSchools.unshift(associatedSchool);
    }

    let schoolsText = '';

    if (sortedSchools.length === 1) {
      schoolsText = <b>{sortedSchools[0].name}</b>;
    } else if (sortedSchools.length === 2) {
      schoolsText = <span><b>{sortedSchools[0].name}</b> and <b>{sortedSchools[1].name}</b></span>;
    } else if (sortedSchools.length === 3) {
      schoolsText = <span><b>{sortedSchools[0].name}</b>, <b>{sortedSchools[1].name}</b>, and <b>{sortedSchools[2].name}</b></span>;
    } else {
      const tooltip = (
        <Tooltip
          tooltipText={sortedSchools.slice(2).map(s => s.name).join('<br/>')}
          tooltipTriggerText={<b>{sortedSchools.length - 2} more</b>}
        />
      )
      schoolsText = <span><b>{sortedSchools[0].name}</b>, <b>{sortedSchools[1].name}</b>, and {tooltip}</span>;
    }

    return (
      <p className="subheader">Thanks for being an admin of {schoolsText}.</p>
    )
  }

  function renderLogInAsATeacherModal() {
    if (!showLoginAsTeacherModal) { return }

    const schoolOptions = model.schools.map(school => ({ value: school.id, label: school.name, id: school.id })) || []
    const teacherOptions = model.teachers.map(teacher => ({ value: teacher.id, label: teacher.name, schoolId: teacher.schools[0].id, id: teacher.id })) || []

    return (
      <LogInAsATeacherModal
        handleCloseModal={closeLogInAsATeacherModal}
        schoolOptions={schoolOptions}
        teacherOptions={teacherOptions}
      />
    )
  }

  if (!adminInfo || !Object.keys(adminInfo).length) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="white-background-accommodate-footer premium-hub-overview">
      <div className="container">
        <Snackbar text={snackbarText} visible={showSnackbar} />
        <h1>Hello{adminInfo.name ? `, ${adminInfo.name.split(' ')[0]}` : ''}!</h1>
        {renderLogInAsATeacherModal()}
        {renderSubheader()}
        <HighlightsSection
          pusherChannel={pusherChannel}
          schools={adminInfo?.schools}
        />
        <ProfessionalDevelopmentSection
          adminId={adminId}
          administersSchoolWithPremium={adminInfo.administers_school_with_premium}
        />
        <AccountManagementSection
          handleClickLogInAsATeacher={handleClickLogInAsATeacher}
          loading={loading}
        />
        <PremiumReportsSection />
        <IntegrationsSection />
      </div>
    </div>
  );
}

export default Overview
