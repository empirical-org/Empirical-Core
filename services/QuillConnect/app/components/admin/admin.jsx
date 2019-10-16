import React from 'react';
import activeComponent from 'react-router-active-component';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import NavBar from '../navbar/navbar.jsx';
import * as userActions from '../../actions/users';
import conceptActions from '../../actions/concepts';
import conceptsFeedbackActions from '../../actions/concepts-feedback';
import questionActions from '../../actions/questions';
import fillInBlankActions from '../../actions/fillInBlank';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import lessonActions from '../../actions/lessons';
import levelActions from '../../actions/item-levels';
import diagnosticLessonActions from '../../actions/diagnosticLessons'
import * as titleCardActions from '../../actions/titleCards.ts';

const TabLink = props => (
  <li>
    <Link activeClassName="is-active" to={props.to}>{props.children}</Link>
  </li>
);

// activeComponent('li');

const adminContainer = React.createClass({
  componentWillMount() {
    this.props.dispatch(userActions.firebaseAuth());
    this.props.dispatch(conceptActions.startListeningToConcepts());
    this.props.dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    this.props.dispatch(questionActions.startListeningToQuestions());
    this.props.dispatch(fillInBlankActions.startListeningToQuestions());
    this.props.dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    this.props.dispatch(levelActions.startListeningToItemLevels());
    this.props.dispatch(titleCardActions.startListeningToTitleCards())
    this.props.dispatch(diagnosticLessonActions.loadDiagnosticLessons())
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
              <TabLink activeClassName="is-active" to={'/admin/datadash'}>Score Analysis</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/question-health'}>Question Health</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/lessons'}>Activities</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/questions'}>Sentence Combining</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/sentence-fragments'}>Sentence Fragments</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/fill-in-the-blanks'}>Fill In The Blanks</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/concepts'}>Concepts</TabLink>
              <TabLink activeClassName="is-active" to={'admin/concepts-feedback'}>Concept Feedback</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/item-levels'}>Item Levels</TabLink>
            </ul>
            <p className="menu-label">
              Title Cards
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/title-cards'}>Title Cards</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {this.props.children}
          </div>
        </section>
      </div>
    );
  },
});

function select(state) {
  return {
  };
}

export default connect(select)(adminContainer);
