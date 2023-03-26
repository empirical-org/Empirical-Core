import * as React from 'react';

import { COMPLETED_ACTIVITIES, TO_DO_ACTIVITIES } from '../../../../constants/student_profile';

const BREAKPOINT = 682

interface StudentProfileClassworkTabsProps {
  onClickTab: (string: string) => void;
  activeClassworkTab: string;
}

export default class StudentProfileClassworkTabs extends React.Component<StudentProfileClassworkTabsProps, {}> {
  text = (string) => {
    if (window.innerWidth > BREAKPOINT) { return string }

    return string.split(' ')[0]
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

    const toDoActivitiesTabClassName = activeClassworkTab === TO_DO_ACTIVITIES ? "quill-tab active" : "quill-tab"
    const completedActivitiesTabClassName = activeClassworkTab === COMPLETED_ACTIVITIES ? "quill-tab active" : "quill-tab"

    return (
      <div className="student-profile-tab-container">
        <div className="container">
          <div className="student-profile-tabs">
            <button className={toDoActivitiesTabClassName} onClick={this.handleToDoActivitiesClick} type="button">{this.text(TO_DO_ACTIVITIES)}</button>
            <button className={completedActivitiesTabClassName} onClick={this.handleCompletedActivitiesClick} type="button">{this.text(COMPLETED_ACTIVITIES)}</button>
          </div>
        </div>
      </div>
    );
  };
}
