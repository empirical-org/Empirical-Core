import React from 'react';

import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'
import TeacherGeneralAccountInfo from '../components/accounts/edit/teacher_general'
import TeacherPasswordAccountInfo from '../components/accounts/edit/update_password'
import TeacherLinkedAccounts from '../components/accounts/edit/teacher_linked_accounts'
import TeacherEmailNotifications from '../components/accounts/edit/teacher_email_notifications'
import TeacherGradeLevels from '../components/accounts/edit/teacher_grade_levels'
import TeacherSubjectAreas from '../components/accounts/edit/teacher_subject_areas'
import TeacherDangerZone from '../components/accounts/edit/teacher_danger_zone'
import { requestPut, requestPost, } from '../../../modules/request/index';

function gradeLevelToOption(gradeLevel) {
  return gradeLevel ? { value: gradeLevel, label: gradeLevel, } : null
}

const PASSWORD = 'password'
const GRADE_LEVEL = 'gradeLevel'
const SUBJECT_AREAS = 'subjectAreas'
const GENERAL = 'general'

export default class TeacherAccount extends React.Component {
  constructor(props) {
    super(props)

    const {
      name,
      email,
      clever_id,
      google_id,
      time_zone,
      school,
      school_type,
      send_newsletter,
      minimum_grade_level,
      maximum_grade_level,
      subject_area_ids,
    } = props.accountInfo
    this.state = {
      activeSection: null,
      name,
      email,
      timeZone: time_zone,
      school,
      schoolType: school_type,
      googleId: google_id,
      cleverId: clever_id,
      sendNewsletter: send_newsletter,
      minimumGradeLevel: minimum_grade_level,
      maximumGradeLevel: maximum_grade_level,
      selectedSubjectAreaIds: subject_area_ids,
      snackbarCopy: '',
      showSnackbar: false,
      errors: {},
      timesSubmitted: 0
    }
  }

  UNSAFE_componentWillMount() {
    let snackbarCopy
    const { googleOrCleverJustSet, accountInfo, } = this.props
    if (googleOrCleverJustSet) {
      if (accountInfo.google_id) {
        snackbarCopy = 'Google linked'
      }
      if (accountInfo.clever_id) {
        snackbarCopy = 'Clever linked'
      }
      this.setState({ snackbarCopy, }, this.showSnackbar)
    }
  }

  activateSection = section => {
    this.setState({ activeSection: section, })
  };

  deactivateSection = section => {
    const { activeSection } = this.state
    if (activeSection === section) {
      this.setState({ activeSection: null, errors: {}, })
    }
  };

  deleteAccount = () => {
    const { accountInfo } = this.props
    const { id, } = accountInfo

    requestPost(
      `${process.env.DEFAULT_URL}/teachers/clear_data/${id}`,
      {},
      () => window.location.href = window.location.origin
    )
  };

  showSnackbar = () => {
    this.setState({ showSnackbar: true, }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  };

  updateTeacherInfo = (data, snackbarCopy) => {
    requestPut(
      '/teacher_infos',
      data,
      (body) => {
        const {
          minimum_grade_level,
          maximum_grade_level,
          subject_area_ids
        } = body
        this.setState({
          minimumGradeLevel: minimum_grade_level,
          maximumGradeLevel: maximum_grade_level,
          selectedSubjectAreaIds: subject_area_ids,
          snackbarCopy,
          errors: {}
        }, () => {
          this.showSnackbar()
          this.setState({ activeSection: null, })
        })
      },
      (body) => {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1, })
      }
    )
  }

  updateUser = (data, url, snackbarCopy) => {
    const { timesSubmitted, } = this.state
    requestPut(
      `${process.env.DEFAULT_URL}${url}`,
      data,
      (body) => {
        const {
          name,
          email,
          clever_id,
          google_id,
          time_zone,
          school,
          school_type,
          send_newsletter,
        } = body
        this.setState({
          name,
          email,
          timeZone: time_zone,
          school,
          schoolType: school_type,
          googleId: google_id,
          cleverId: clever_id,
          sendNewsletter: send_newsletter,
          snackbarCopy,
          errors: {}
        }, () => {
          this.showSnackbar()
          this.setState({ activeSection: null, })
        })
      },
      (body) => {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1, })
      }
    )
  };

  renderSnackbar = () => {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  };

  render() {
    const {
      name,
      email,
      cleverId,
      googleId,
      timeZone,
      school,
      schoolType,
      errors,
      timesSubmitted,
      activeSection,
      sendNewsletter,
      postGoogleClassroomAssignments,
      minimumGradeLevel,
      maximumGradeLevel,
      selectedSubjectAreaIds,
    } = this.state
    const { accountInfo, alternativeSchools, alternativeSchoolsNameMap, cleverLink, showDismissSchoolSelectionReminderCheckbox, subjectAreas, } = this.props
    return (
      <div className="user-account">
        <TeacherGeneralAccountInfo
          activateSection={() => this.activateSection(GENERAL)}
          active={activeSection === GENERAL}
          alternativeSchools={alternativeSchools}
          alternativeSchoolsNameMap={alternativeSchoolsNameMap}
          cleverId={cleverId}
          deactivateSection={() => this.deactivateSection(GENERAL)}
          email={email}
          errors={errors}
          googleId={googleId}
          name={name}
          school={school}
          schoolType={schoolType}
          showDismissSchoolSelectionReminderCheckbox={showDismissSchoolSelectionReminderCheckbox}
          timesSubmitted={timesSubmitted}
          timeZone={timeZone}
          updateUser={this.updateUser}
        />
        <TeacherPasswordAccountInfo
          activateSection={() => this.activateSection(PASSWORD)}
          active={activeSection === PASSWORD}
          cleverId={cleverId}
          deactivateSection={() => this.deactivateSection(PASSWORD)}
          errors={errors}
          googleId={googleId}
          role={accountInfo.role}
          timesSubmitted={timesSubmitted}
          updateUser={this.updateUser}
        />
        <TeacherLinkedAccounts
          cleverId={cleverId}
          cleverLink={cleverLink}
          email={email}
          errors={errors}
          googleId={googleId}
          postGoogleClassroomAssignments={postGoogleClassroomAssignments}
          timesSubmitted={timesSubmitted}
          updateUser={this.updateUser}
        />
        <TeacherEmailNotifications
          sendNewsletter={sendNewsletter}
          updateUser={this.updateUser}
        />
        <TeacherGradeLevels
          activateSection={() => this.activateSection(GRADE_LEVEL)}
          active={activeSection === GRADE_LEVEL}
          deactivateSection={() => this.deactivateSection(GRADE_LEVEL)}
          passedMaximumGradeLevel={gradeLevelToOption(maximumGradeLevel)}
          passedMinimumGradeLevel={gradeLevelToOption(minimumGradeLevel)}
          updateTeacherInfo={this.updateTeacherInfo}
        />
        <TeacherSubjectAreas
          activateSection={() => this.activateSection(SUBJECT_AREAS)}
          active={activeSection === SUBJECT_AREAS}
          deactivateSection={() => this.deactivateSection(SUBJECT_AREAS)}
          passedSelectedSubjectAreaIds={selectedSubjectAreaIds}
          subjectAreas={subjectAreas}
          updateTeacherInfo={this.updateTeacherInfo}
        />
        <TeacherDangerZone
          deleteAccount={this.deleteAccount}
        />
        {this.renderSnackbar()}
      </div>
    )
  }
}
