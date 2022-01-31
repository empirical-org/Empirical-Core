import React from 'react';
import { NavLink } from 'react-router-dom';

const TabLink = ({ children, to }) => {
  return (
    <li>
      <NavLink activeClassName="is-active" to={to}>{children}</NavLink>
    </li>
  )
};

const AdminMainSidebar = () => {
  return (
    <section className="main-admin-section section is-fullheight">
      <aside className="admin-menu">
        <p className="menu-label">
          General
        </p>
        <ul className="menu-list">
          <TabLink activeClassName="is-active" to='/admin/lessons'>Activities</TabLink>
        </ul>
        <p className="menu-label">
          Questions
        </p>
        <ul className="menu-list">
          <TabLink activeClassName="is-active" to='/admin/questions'>Sentence Combining</TabLink>
          <TabLink activeClassName="is-active" to='/admin/sentence-fragments'>Sentence Fragments</TabLink>
          <TabLink activeClassName="is-active" to='/admin/fill-in-the-blanks'>Fill In The Blanks</TabLink>
        </ul>
        <p className="menu-label">
          Supporting
        </p>
        <ul className="menu-list">
          <TabLink activeClassName="is-active" to='/admin/concepts'>Concepts</TabLink>
          <TabLink activeClassName="is-active" to='/admin/concepts-feedback'>Concept Feedback</TabLink>
        </ul>
        <p className="menu-label">
          Title Cards
        </p>
        <ul className="menu-list">
          <TabLink activeClassName="is-active" to='/admin/title-cards'>Title Cards</TabLink>
        </ul>
        <p className="menu-label">
          Activity Health
        </p>
        <ul className="menu-list">
          <TabLink activeClassName="is-active" to='/admin/activity-health'>Activity Health</TabLink>
        </ul>
      </aside>
    </section>
  );
}

export default AdminMainSidebar;
