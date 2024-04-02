import * as React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import AdminClassroomLessonsContainer from '../classroomLessons/admin/container';

const TabLink = ({ to, children, }) => (
  <li>
    <Link activeClassName="is-active" to={to}>{children}</Link>
  </li>
);

const AdminContainer = () => {
  return (
    <div>
      <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0, }}>
        <aside className="menu" style={{ minWidth: 220, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, }}>
          <p className="menu-label">
            General
          </p>
          <ul className="menu-list">
            <TabLink activeClassName="is-active" to='/admin/classroom-lessons'>Classroom Lessons</TabLink>
          </ul>
        </aside>
        <div className="admin-container">
          <Switch>
            <Route component={AdminClassroomLessonsContainer} path='/admin/classroom-lessons' />
          </Switch>
        </div>
      </section>
    </div>
  )
}

function select(state) {
  return {
  };
}

export default withRouter(AdminContainer);
