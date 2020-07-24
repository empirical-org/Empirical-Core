import React from 'react';
import Lesson from '../lessons/lesson.jsx';

const AdminLessonSidebar = ({ match }) => {
  return (
    <section className="section is-fullheight lesson-sidebar-section">
      <aside className="menu lesson-sidebar">
        <Lesson isSidebar={true} location={location} match={match} />
      </aside>
    </section>
  )
}

export default AdminLessonSidebar;
