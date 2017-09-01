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
    const userFlag = document.getElementById('current-user-flag').getAttribute('content');
    const lessons = userFlag === 'beta' ? <li><a href="/teachers/classrooms/activity_planner/lessons" className={this.state.lessons}>Lessons</a></li> : null;
    return (
      <div className="unit-tabs tab-subnavigation-wrapper">
        <div className="container">
          <ul>
            <li><a href="/teachers/classrooms/activity_planner" className={this.state.allActivityPacks}>All Activity Packs</a></li>
            {lessons}
          </ul>
        </div>
      </div>
    );
  },

});
