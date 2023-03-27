import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import conceptActions from '../../actions/concepts';
import conceptsFeedbackActions from '../../actions/concepts-feedback';
import fillInBlankActions from '../../actions/fillInBlank';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import * as titleCardActions from '../../actions/titleCards.ts';
import Concept from '../concepts/concept.jsx';
import Concepts from '../concepts/concepts.jsx';
import ConceptFeedback from '../feedback/concept-feedback.jsx';
import ConceptsFeedback from '../feedback/concepts-feedback.jsx';
import FillInBlankQuestion from '../fillInBlank/fillInBlankQuestion.jsx';
import FillInBlankQuestions from '../fillInBlank/fillInBlankQuestions.jsx';
import NewFillInBlank from '../fillInBlank/newFillInBlank';
import TestFillInBlankQuestionContainer from '../fillInBlank/testFillInBlankQuestionContainer.jsx';
import Lesson from '../lessons/lesson.jsx';
import Lessons from '../lessons/lessons.jsx';
import AnswerVisualizer from '../misc/answerVisualizer.jsx';
import Question from '../questions/question';
import Questions from '../questions/questions.jsx';
import ChooseModelContainer from '../sentenceFragments/chooseModelContainer.jsx';
import NewSentenceFragment from '../sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from '../sentenceFragments/sentenceFragment.jsx';
import SentenceFragments from '../sentenceFragments/sentenceFragments.jsx';
import TestSentenceFragmentContainer from '../sentenceFragments/testSentenceFragmentContainer.jsx';
import DiagnosticRouter from '../shared/diagnosticRouter.tsx';
import ShowTitleCard from '../titleCards/showTitleCard.tsx';
import TitleCardForm from '../titleCards/titleCardForm.tsx';
import TitleCards from '../titleCards/titleCards.tsx';
const usersEndpoint = `${import.meta.env.VITE_DEFAULT_URL}/api/v1/users.json`;
const newSessionEndpoint = `${import.meta.env.VITE_DEFAULT_URL}/session/new`;

const TabLink = props => {
  const { children, to, } = props
  return (
    <li>
      <Link activeClassName="is-active" to={to}>{children}</Link>
    </li>
  )
}

class Admin extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleAuthCheck();
    dispatch(conceptActions.startListeningToConcepts());
    dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    dispatch(questionActions.loadQuestions());
    dispatch(fillInBlankActions.startListeningToQuestions());
    dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    dispatch(titleCardActions.startListeningToTitleCards());
  }

  handleAuthCheck = () => {
    fetch(usersEndpoint, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      if (response.user.hasOwnProperty('role') && response.user.role !== 'staff'){
        window.location = newSessionEndpoint;
      }
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  render() {
    return (
      <div className="main-admin-container">
        <section className="main-admin-section section is-fullheight">
          <aside className="admin-menu">
            <p className="menu-label">
              General
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to='/admin/lessons'>Diagnostics</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to='/admin/questions'>Diagnostic Sentence Combining</TabLink>
              <TabLink activeClassName="is-active" to='/admin/sentence-fragments'>Diagnostic Sentence Fragments</TabLink>
              <TabLink activeClassName="is-active" to='/admin/fill-in-the-blanks'>Diagnostic Fill In The Blanks</TabLink>
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
          </aside>
        </section>
        <Switch>
          <Redirect component={Lessons} exact from='/admin' to='/admin/lessons' />
          <Route component={ConceptFeedback} path='/admin/concepts-feedback/:conceptFeedbackID' />
          <Route component={ConceptsFeedback} path='/admin/concepts-feedback' />
          <Route component={Concept} path='/admin/concepts/:conceptID' />
          <Route component={Concepts} path='/admin/concepts' />
          <Route component={Lesson} path='/admin/lessons/:lessonID' />
          <Route component={Lessons} path='/admin/lessons' />
          <Route component={Question} path='/admin/questions/:questionID' />
          <Route component={AnswerVisualizer} path='/admin/questions/visualize' />
          <Route component={Questions} path='/admin/questions' />
          <Route component={TitleCardForm} path='/admin/title-cards/new' />
          <Route component={TitleCardForm} path='/admin/title-cards/:titleCardID/edit' />
          <Route component={ShowTitleCard} path='/admin/title-cards/:titleCardID' />
          <Route component={TitleCards} path='/admin/title-cards' />
          <Route component={NewFillInBlank} path='/admin/fill-in-the-blanks/new' />
          <Route component={FillInBlankQuestion} path='/admin/fill-in-the-blanks/:questionID' />
          <Route component={TestFillInBlankQuestionContainer} path='/admin/fill-in-the-blanks/test' />
          <Route component={FillInBlankQuestions} path='/admin/fill-in-the-blanks' />
          <Route component={NewSentenceFragment} path='/admin/sentence-fragments/new' />
          <Route component={SentenceFragment} path='/admin/sentence-fragments/:questionID' />
          <Route component={ChooseModelContainer} path='/admin/sentence-fragments/choose-model' />
          <Route component={TestSentenceFragmentContainer} path='/admin/sentence-fragments/test' />
          <Route component={SentenceFragments} path='/admin/sentence-fragments' />
          <Route component={DiagnosticRouter} path='/play/diagnostic/:diagnosticID' />
        </Switch>
      </div>
    );
  }
}

function select(state) {
  return {
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default withRouter(connect(select, dispatch => ({dispatch}), mergeProps)(Admin));
