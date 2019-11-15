import React from 'react';
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
import levelActions from '../../actions/item-levels';
import * as titleCardActions from '../../actions/titleCards.ts';
import * as connectSentenceCombiningActions from '../../actions/connectSentenceCombining.ts';
import * as connectFillInBlankActions from '../../actions/connectFillInBlank.ts';
import * as connectSentenceFragmentActions from '../../actions/connectSentenceFragments.ts';

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
    this.props.dispatch(questionActions.loadQuestions());
    this.props.dispatch(fillInBlankActions.startListeningToQuestions());
    this.props.dispatch(diagnosticQuestionActions.startListeningToDiagnosticQuestions());
    this.props.dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    this.props.dispatch(levelActions.startListeningToItemLevels());
    this.props.dispatch(titleCardActions.startListeningToTitleCards());
    this.props.dispatch(connectSentenceCombiningActions.startListeningToConnectQuestions())
    this.props.dispatch(connectFillInBlankActions.startListeningToConnectFillInBlankQuestions())
    this.props.dispatch(connectSentenceFragmentActions.startListeningToConnectSentenceFragments())
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
              <TabLink activeClassName="is-active" to={'/admin/datadash'}>Score analysis</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/question-health'}>Question Health</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/lessons'}>Diagnostics</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/clone_questions'}>Clone Connect Questions</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/questions'}>Diagnostic Sentence Combining</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/sentence-fragments'}>Diagnostic Sentence Fragments</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/fill-in-the-blanks'}>Diagnostic Fill In The Blanks</TabLink>
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
