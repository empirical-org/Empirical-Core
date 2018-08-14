import * as React from 'react';
import { Link } from 'react-router';
import { Route } from "react-router-dom";
import { connect } from 'react-redux';
import * as grammarActivitiesActions from '../../actions/grammarActivities'
import * as questionsActions from '../../actions/questions'
import Lessons from '../lessons/lessons'

const TabLink = props => (
  <li>
    <Link to={props.to} activeClassName="is-active">{props.children}</Link>
  </li>
);

// activeComponent('li');

const adminContainer = React.createClass({
  componentWillMount() {
    this.props.dispatch(questionsActions.startListeningToQuestions());
    this.props.dispatch(grammarActivitiesActions.startListeningToActivities());
  },

  render() {
    return (
      <div>
        <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0, }}>
          <aside className="menu" style={{ minWidth: 220, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, }}>
            <p className="menu-label">
              General
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/lessons'} activeClassName="is-active">Grammar Activities</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/questions'} activeClassName="is-active">Questions</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/concepts'} activeClassName="is-active">Concepts</TabLink>
              <TabLink to={'admin/concepts-feedback'} activeClassName="is-active">Concept Feedback</TabLink>
              <TabLink to={'/admin/item-levels'} activeClassName="is-active">Item Levels</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {this.props.children}
          </div>
        </section>
        <Route path={`/admin/lessons`} component={Lessons}/>
      </div>
    );
  },
});

function select(state) {
  return {
  };
}

export default connect(select)(adminContainer);
