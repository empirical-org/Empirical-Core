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
import * as connectSentenceCombiningActions from '../../actions/connectSentenceCombining';
import * as connectFillInBlankActions from '../../actions/connectFillInBlank';
import * as connectSentenceFragmentActions from '../../actions/connectSentenceFragments';

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
              <TabLink to={'/admin/datadash'} activeClassName="is-active">Score analysis</TabLink>
              <TabLink to={'/admin/question-health'} activeClassName="is-active">Question Health</TabLink>
              <TabLink to={'/admin/lessons'} activeClassName="is-active">Diagnostics</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/questions'} activeClassName="is-active">Diagnostic Sentence Combining</TabLink>
              <TabLink to={'/admin/sentence-fragments'} activeClassName="is-active">Diagnostic Sentence Fragments</TabLink>
              <TabLink to={'/admin/fill-in-the-blanks'} activeClassName="is-active">Diagnostic Fill In The Blanks</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/concepts'} activeClassName="is-active">Concepts</TabLink>
              <TabLink to={'admin/concepts-feedback'} activeClassName="is-active">Concept Feedback</TabLink>
              <TabLink to={'/admin/item-levels'} activeClassName="is-active">Item Levels</TabLink>
            </ul>
            <p className="menu-label">
              Title Cards
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/title-cards'} activeClassName="is-active">Title Cards</TabLink>
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
