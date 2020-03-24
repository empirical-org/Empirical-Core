import React from 'react';

export default class MyActivitiesTabs extends React.Component {
  constructor(props) {
    super(props);
    if ((window.location.pathname === '/teachers/classrooms/activity_planner')) {
      this.state = { allActivityPacks: 'active', };
      return;
    } else if (window.location.pathname.includes('/lessons')) {
      this.state = { lessons: 'active', };
      return;
    }
    this.state = {};
  }

  render() {
    return (
      <div className="unit-tabs tab-subnavigation-wrapper">
        <div className="container">
          <ul>
            <li><a className={this.state.allActivityPacks} href="/teachers/classrooms/activity_planner">My Activity Packs</a></li>
            <li><a className={this.state.lessons} href="/teachers/classrooms/activity_planner/lessons">Launch Lessons</a></li>
          </ul>
        </div>
      </div>
    );
  }
}
