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
            <li><a href="/teachers/classrooms/activity_planner" className={this.state.allActivityPacks}>My Activity Packs</a></li>
            <li><a href="/teachers/classrooms/activity_planner/lessons" className={this.state.lessons}>Launch Lessons</a></li>
          </ul>
        </div>
      </div>
    );
  },

});
