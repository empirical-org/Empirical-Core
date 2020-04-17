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
import diagnosticLessonActions from '../../actions/diagnosticLessons'
import * as titleCardActions from '../../actions/titleCards.ts';

const TabLink = props => {
  const { children, to } = props
  return (<li>
    <Link activeClassName="is-active" to={to}>{children}</Link>
  </li>)
};

// activeComponent('li');

const adminContainer = React.createClass({
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(userActions.firebaseAuth());
    dispatch(conceptActions.startListeningToConcepts());
    dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    dispatch(questionActions.startListeningToQuestions());
    dispatch(fillInBlankActions.startListeningToQuestions());
    dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    dispatch(titleCardActions.startListeningToTitleCards())
    dispatch(diagnosticLessonActions.loadDiagnosticLessons())
  },

  render() {
    const { children, } = this.props
    return (
      <div>
        <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0, }}>
          <aside className="menu" style={{ minWidth: 220, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, }}>
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
              <TabLink activeClassName="is-active" to='admin/concepts-feedback'>Concept Feedback</TabLink>
            </ul>
            <p className="menu-label">
              Title Cards
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to='/admin/title-cards'>Title Cards</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {children}
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
