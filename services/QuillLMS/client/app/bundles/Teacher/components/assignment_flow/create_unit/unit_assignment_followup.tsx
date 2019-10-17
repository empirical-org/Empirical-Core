import * as React from 'react'

import { Card, Input, Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ScrollToTop from '../../shared/scroll_to_top'

const assignedActivitiesSrc = `${process.env.CDN_URL}/images/illustrations/assigned-activities.svg`
const assignActivitiesSrc = `${process.env.CDN_URL}/images/illustrations/assign-activities.svg`
const addStudentsSrc = `${process.env.CDN_URL}/images/illustrations/add-students.svg`
const giftSrc = `${process.env.CDN_URL}/images/illustrations/gift.svg`
const twitterSrc = `${process.env.CDN_URL}/images/icons/ui-share-twitter.svg`
const facebookSrc = `${process.env.CDN_URL}/images/icons/ui-share-facebook.svg`
const googleSrc = `${process.env.CDN_URL}/images/icons/ui-share-google.svg`
const emailSrc = `${process.env.CDN_URL}/images/icons/ui-share-email.svg`

interface UnitAssignmentFollowupProps {
  classrooms: Array<any>;
  selectedActivities: Array<any>;
  unitName: string;
  referralCode: string;
}

interface UnitAssignmentFollowupState {
  showNextOptions: boolean;
  assignedClassrooms: Array<any>;
  showSnackbar: boolean;
  snackbarCopy: string;
}

export default class UnitAssignmentFollowup extends React.Component<UnitAssignmentFollowupProps, UnitAssignmentFollowupState> {
  constructor(props) {
    super(props)

    const assignedClassrooms = props.classrooms.filter(c => c.classroom.emptyClassroomSelected || c.students.find(s => s.isSelected))

    this.state = {
      showNextOptions: false,
      assignedClassrooms,
      showSnackbar: false,
      snackbarCopy: ''
    }
  }

  showSnackbar = (snackbarCopy) => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  setNextOptions = () => {
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

  renderInviteStudents = () => {
    const { assignedClassrooms, } = this.state
    const { unitName, classrooms, } = this.props
    const emptyClassrooms = classrooms.filter(c => !c.students.length)
    return (<div className="unit-assignment-followup invite-students">
      <h1>Success! You assigned {unitName} to {this.numberOfClassroomsText(assignedClassrooms)}.</h1>
      <Card
        header="Invite students to your classes"
        imgAlt="students"
        imgSrc={addStudentsSrc}
        onClick={() => { window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms`}}
        text={`You currently have ${this.numberOfClassroomsText(emptyClassrooms)} that ${emptyClassrooms.length === 1 ? 'has' : 'have'} no students.`}
      />
    </div>)
  }

  renderNextOptions = () => {
    return (<div className="unit-assignment-followup next-options">
      <h1>What would you like to do next?</h1>
      <Card
        header="See what I have assigned"
        imgAlt="clipboard with check"
        imgSrc={assignedActivitiesSrc}
        onClick={() => { window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms/activity_planner`}}
        text="View your assigned packs."
      />
      <Card
        header="Invite students"
        imgAlt="students"
        imgSrc={addStudentsSrc}
        onClick={() => { window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms`}}
        text="Add students to your classes."
      />
      <Card
        header="Assign more activities"
        imgAlt="squares with plus sign"
        imgSrc={assignActivitiesSrc}
        onClick={() => { window.location.href = `${process.env.DEFAULT_URL}/teachers/classrooms/assign_activities`}}
        text="Select or build another pack."
      />
    </div>)
  }

  renderReferral = () => {
    const { assignedClassrooms, } = this.state
    const { unitName, referralCode, } = this.props
    const referralLink = `${process.env.DEFAULT_URL}/?referral_code=${referralCode}`
    return <div className="unit-assignment-followup referral">
      {this.renderSnackbar()}
      <h1>Success! You assigned {unitName} to {this.numberOfClassroomsText(assignedClassrooms)}.</h1>
      <div className="referral-card">
        <img alt="gift" src={giftSrc} />
        <h1>Share Quill and earn a month of free Quill Premium for Teachers.</h1>
        <p>As a nonprofit organization that provides free activities, Quill relies on teachers to share the word. </p>
        <p>For every teacher that signs up for Quill with your referral link and completes an activity with their students, you earn a month of free Quill Premium, and they receive a one-month free trial.</p>
        <div className='share-box'>
          <div className="referral-link-container">
            <Input
              disabled={true}
              id="referral-link"
              value={referralLink}
            />
            <CopyToClipboard onCopy={() => this.showSnackbar('Link copied')} text={referralLink}>
              <button className="quill-button secondary outlined small">Copy link</button>
            </CopyToClipboard>
          </div>
          <p className="share-text">More ways to share: </p>
          <div className='share-links'>
            <a href={`https://twitter.com/home?status=I'm using @quill_org to help my students become better writers and critical thinkers. Want to join me? ${referralLink}`} target="_blank"><img alt="twitter icon" src={twitterSrc} /></a>
            <a href={`https://www.facebook.com/share.php?u=${referralLink}`} target="_blank"><img alt="facebook icon" src={facebookSrc} /></a>
            <a href={`https://plus.google.com/share?url=${referralLink}`} target="_blank"><img alt="google plus icon" src={googleSrc} /></a>
            <a href={`mailto:mailto:?subject=Free tool to help your students become better writers&body=Hi! I've been using this free tool called Quill.org to help my students become better writers and critical thinkers, and I wanted to let you know about it. Hopefully it helps your students as much as it's helped mine! ${referralLink}`} target="_blank"><img alt="mail" src={emailSrc} /></a>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button className="quill-button primary contained medium" onClick={this.setNextOptions}>Next</button>
      </div>
    </div>
  }

  renderFollowUp = () => {
    const { showNextOptions, assignedClassrooms } = this.state
    if (!showNextOptions) {
      const allAssignedClassroomsAreEmpty = assignedClassrooms.every(c => c.classroom.emptyClassroomSelected)
      if (allAssignedClassroomsAreEmpty) {
        return this.renderInviteStudents()
      } else {
        return this.renderReferral()
      }
    }
    return this.renderNextOptions()
  }

  render() {
    return (<div>
      <ScrollToTop />
      {this.renderFollowUp()}
    </div>)
  }
}
