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
import diagnosticQuestionActions from '../../actions/diagnosticQuestions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import lessonActions from '../../actions/lessons';
import levelActions from '../../actions/item-levels';

const TabLink = props => (
  <li>
    <Link to={props.to} activeClassName="is-active">{props.children}</Link>
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
    this.props.dispatch(diagnosticQuestionActions.startListeningToDiagnosticQuestions());
    this.props.dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    this.props.dispatch(levelActions.startListeningToItemLevels());
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
              <TabLink to={'/admin/datadash'} activeClassName="is-active">Score Analysis</TabLink>
              <TabLink to={'/admin/question-health'} activeClassName="is-active">Question Health</TabLink>
              <TabLink to={'/admin/lessons'} activeClassName="is-active">Lessons</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/questions'} activeClassName="is-active">Sentence Combining</TabLink>
              <TabLink to={'/admin/diagnostic-questions'} activeClassName="is-active">Diagnostic Questions</TabLink>
              <TabLink to={'/admin/sentence-fragments'} activeClassName="is-active">Sentence Fragments</TabLink>
              <TabLink to={'/admin/fill-in-the-blanks'} activeClassName="is-active">Fill In The Blanks</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/concepts'} activeClassName="is-active">Concepts</TabLink>
              <TabLink to={'admin/concepts-feedback'} activeClassName="is-active">Concept Feeback</TabLink>
              <TabLink to={'/admin/item-levels'} activeClassName="is-active">Item Levels</TabLink>
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
