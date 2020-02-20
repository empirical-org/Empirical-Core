import * as React from 'react'
import { ALL_ACTIVITIES, TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../../constants/student_profile'

export default class StudentProfileClassworkTabs extends React.Component {
  handleAllActivitiesClick = () => {
    const { onClickTab, } = this.props
    onClickTab(ALL_ACTIVITIES)
  }

  handleToDoActivitiesClick = () => {
    const { onClickTab, } = this.props
    onClickTab(TO_DO_ACTIVITIES)
  }

  handleCompletedActivitiesClick = () => {
    const { onClickTab, } = this.props
    onClickTab(COMPLETED_ACTIVITIES)
  }

  render() {
    const { activeClassworkTab, } = this.props

    const allActivitiesTabClassName = activeClassworkTab === ALL_ACTIVITIES ? "quill-tab active" : "quill-tab"
    const toDoActivitiesTabClassName = activeClassworkTab === TO_DO_ACTIVITIES ? "quill-tab active" : "quill-tab"
    const completedActivitiesTabClassName = activeClassworkTab === COMPLETED_ACTIVITIES ? "quill-tab active" : "quill-tab"

    return (
      <div className="student-profile-tab-container">
        <div className="container">
          <div className="student-profile-tabs">
            <button className={allActivitiesTabClassName} onClick={this.handleAllActivitiesClick} type="button">{ALL_ACTIVITIES}</button>
            <button className={toDoActivitiesTabClassName} onClick={this.handleToDoActivitiesClick} type="button">{TO_DO_ACTIVITIES}</button>
            <button className={completedActivitiesTabClassName} onClick={this.handleCompletedActivitiesClick} type="button">{COMPLETED_ACTIVITIES}</button>
          </div>
        </div>
      </div>
    );
  };
}
