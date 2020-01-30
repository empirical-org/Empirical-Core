import React from 'react';

export default React.createClass({

  getInitialState() {
    if ((window.location.pathname === '/teachers/classrooms/activity_planner')) {
      return { allActivityPacks: 'active', };
    } else if (window.location.pathname.includes('/lessons')) {
      return { lessons: 'active', };
    }
    return {};
  },

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
  },

});
