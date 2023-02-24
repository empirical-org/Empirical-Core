import * as React from 'react'

import { Card, Snackbar, defaultSnackbarTimeout } from '../../../../Shared/index'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import AssignmentFlowNavigation from '../assignment_flow_navigation'

import {
  UNIT_TEMPLATE_NAME,
  UNIT_TEMPLATE_ID,
  UNIT_NAME,
  ACTIVITY_IDS_ARRAY,
  CLASSROOMS,
  UNIT_ID,
} from '../assignmentFlowConstants'

import ScrollToTop from '../../shared/scroll_to_top'
import ViewAsStudentModal from '../../shared/view_as_student_modal'
import { Input, } from '../../../../Shared/index'

const assignedActivitiesSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/assigned-activities.svg`
const assignActivitiesSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/assign-activities.svg`
const addStudentsSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/add-students.svg`
const giftSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/gift.svg`
const viewStudentSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/view-student.svg`
const twitterSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/ui-share-twitter.svg`
const facebookSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/ui-share-facebook.svg`
const googleSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/ui-share-google.svg`
const emailSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/ui-share-email.svg`

interface UnitAssignmentFollowupProps {
  classrooms: Array<any>;
  selectedActivities: Array<any>;
  unitName: string;
  referralCode: string;
  location: any;
  history: any;
}

interface UnitAssignmentFollowupState {
  showNextOptions: boolean;
  showViewAsStudentModal: boolean;
  assignedClassrooms: Array<any>;
  showSnackbar: boolean;
  snackbarCopy: string;
  leaving: boolean;
}

export default class UnitAssignmentFollowup extends React.Component<UnitAssignmentFollowupProps, UnitAssignmentFollowupState> {
  constructor(props) {
    super(props)

    const assignedClassrooms = props.classrooms.filter(c => c.classroom.emptyClassroomSelected || c.students.find(s => s.isSelected))

    this.state = {
      showViewAsStudentModal: false,
      showNextOptions: props.location.pathname === '/assign/next',
      assignedClassrooms,
      showSnackbar: false,
      snackbarCopy: '',
      leaving: false
    }
  }

  componentWillUnmount() {
    this.prepareToLeavePage()
  }

  prepareToLeavePage = async () => {
    return new Promise((resolve) => {
      return this.setState({ leaving: true, }, () => {
        window.localStorage.removeItem(UNIT_TEMPLATE_ID)
        window.localStorage.removeItem(UNIT_TEMPLATE_NAME)
        window.localStorage.removeItem(UNIT_NAME)
        window.localStorage.removeItem(ACTIVITY_IDS_ARRAY)
        window.localStorage.removeItem(CLASSROOMS)
        window.localStorage.removeItem(UNIT_ID)
        resolve()
      })
    })
  }

  allAssignedClassroomsAreEmpty = () => {
    const { assignedClassrooms, } = this.state
    return assignedClassrooms.every(c => c.classroom.emptyClassroomSelected)
  }

  showSnackbar = (snackbarCopy) => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  handleCopyLink = () => this.showSnackbar('Link copied')

  handleClickNext = () => {
    const { history, } = this.props
    history.push('/assign/next')
    this.setState({ showNextOptions: true })
  }

  renderSnackbar = () => {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  numberOfClassroomsText = (classrooms) => {
    const numberOfClassrooms = classrooms.length
    return `${numberOfClassrooms} ${numberOfClassrooms === 1 ? 'class' : 'classes'}`
  }

  handleClickToDashboard = () => this.prepareToLeavePage().then(() => window.location.href = import.meta.env.VITE_DEFAULT_URL)

  handleGoToClassroomIndex = () => this.prepareToLeavePage().then(() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/teachers/classrooms`)

  handleGoToAssignedActivity = () => {
    const unitId = window.localStorage.getItem(UNIT_ID)
    this.prepareToLeavePage().then(() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/teachers/classrooms/activity_planner#${unitId}`)
  }

  handleGoToAssignMoreActivities = () => this.prepareToLeavePage().then(() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/assign`)

  onClickViewAsIndividualStudent = (studentId) => this.prepareToLeavePage().then(() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/teachers/preview_as_student/${studentId}`)

  handleViewAsStudent = () => this.setState({ showViewAsStudentModal: true, })

  closeViewAsStudentModal = () => this.setState({ showViewAsStudentModal: false, })

  renderInviteStudents = () => {
    const { classrooms, } = this.props
    const emptyClassrooms = classrooms.filter(c => !c.students.length)
    return (
      <div className="unit-assignment-followup invite-students">
        <h1>Assigned!</h1>
        <Card
          header="Invite students to your classes"
          imgAlt="students"
          imgSrc={addStudentsSrc}
          onClick={this.handleGoToClassroomIndex}
          text={`You currently have ${this.numberOfClassroomsText(emptyClassrooms)} that ${emptyClassrooms.length === 1 ? 'has' : 'have'} no students.`}
        />
      </div>
    )
  }

  renderNextOptions = () => (
    <div className="unit-assignment-followup next-options">
      <h1>What would you like to do next?</h1>
      <Card
        header="See what I have assigned"
        imgAlt="Clipboard with check"
        imgSrc={assignedActivitiesSrc}
        onClick={this.handleGoToAssignedActivity}
        text="View your assigned packs."
      />
      <Card
        header="Invite students"
        imgAlt="Four person icons in a circle"
        imgSrc={addStudentsSrc}
        onClick={this.handleGoToClassroomIndex}
        text="Add students to your classes."
      />
      <Card
        header="Assign more activities"
        imgAlt="Stacked pages with plus sign on top one"
        imgSrc={assignActivitiesSrc}
        onClick={this.handleGoToAssignMoreActivities}
        text="Select or build another pack."
      />
      <Card
        header="View as student"
        imgAlt="Magnifying glass around person icon"
        imgSrc={viewStudentSrc}
        onClick={this.handleViewAsStudent}
        text="Preview what students will see on their dashboards."
      />
    </div>
  )

  renderReferral = () => {
    const { referralCode, } = this.props
    const referralLink = `${import.meta.env.VITE_DEFAULT_URL}/?referral_code=${referralCode}`
    return (
      <div className="unit-assignment-followup referral">
        {this.renderSnackbar()}
        <div className="referral-card">
          <img alt="gift" src={giftSrc} />
          <h1>Recommend Quill and earn a month of free Quill Premium for Teachers.</h1>
          <p>As a nonprofit organization that provides free activities, Quill relies on teachers to share the word.</p>
          <p>For every teacher that signs up for Quill with your referral link and completes an activity with their students, you earn a month of free Quill Premium, and they receive a one-month free trial.</p>
          <div className='share-box'>
            <div className="referral-link-container">
              <Input
                disabled={true}
                id="referral-link"
                value={referralLink}
              />
              <CopyToClipboard onCopy={this.handleCopyLink} text={referralLink}>
                <button className="quill-button secondary outlined small" type="button">Copy link</button>
              </CopyToClipboard>
            </div>
            <p className="share-text">More ways to share: </p>
            <div className='share-links'>
              <a href={`https://twitter.com/home?status=I'm using @quill_org to help my students become better writers and critical thinkers. Want to join me? ${referralLink}`} rel="noopener noreferrer" target="_blank"><img alt="twitter icon" src={twitterSrc} /></a>
              <a href={`https://www.facebook.com/share.php?u=${referralLink}`} rel="noopener noreferrer" target="_blank"><img alt="facebook icon" src={facebookSrc} /></a>
              <a href={`https://plus.google.com/share?url=${referralLink}`} rel="noopener noreferrer" target="_blank"><img alt="google plus icon" src={googleSrc} /></a>
              <a href={`mailto:mailto:?subject=Free tool to help your students become better writers&body=Hi! I've been using this free tool called Quill.org to help my students become better writers and critical thinkers, and I wanted to let you know about it. Hopefully it helps your students as much as it's helped mine! ${referralLink}`} rel="noopener noreferrer" target="_blank"><img alt="mail" src={emailSrc} /></a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderFollowUp = () => {
    const { showNextOptions, leaving, } = this.state
    if (leaving) return
    if (!showNextOptions) {
      return this.renderReferral()
    }
    return this.renderNextOptions()
  }

  renderViewAsStudentModal() {
    const { showViewAsStudentModal, } = this.state
    const { classrooms, } = this.props

    if (!showViewAsStudentModal) { return }

    const classroomsToPass = classrooms.map(c => {
      c.classroom.students = c.students
      return c.classroom
    })

    return (
      <ViewAsStudentModal
        classrooms={classroomsToPass}
        close={this.closeViewAsStudentModal}
        handleViewClick={this.onClickViewAsIndividualStudent}
      />
    )
  }

  render() {
    const { showNextOptions, } = this.state
    let button = <button className="quill-button medium contained primary" onClick={this.handleClickToDashboard} type="button">Take me to my dashboard</button>
    if (!(showNextOptions || this.allAssignedClassroomsAreEmpty())) {
      button = <button className="quill-button medium contained primary" onClick={this.handleClickNext} type="button">Next</button>
    }
    return (
      <div>
        <AssignmentFlowNavigation button={button} />
        <ScrollToTop />
        {this.renderViewAsStudentModal()}
        <div className="container">
          {this.renderFollowUp()}
        </div>
      </div>
    )
  }
}
