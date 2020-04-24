import React from 'react';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userActions from '../../actions/users';
import conceptActions from '../../actions/concepts';
import conceptsFeedbackActions from '../../actions/concepts-feedback';
import questionActions from '../../actions/questions';
import fillInBlankActions from '../../actions/fillInBlank';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import diagnosticLessonActions from '../../actions/diagnosticLessons'
import * as titleCardActions from '../../actions/titleCards.ts';
import ConceptsFeedback from '../feedback/concepts-feedback.jsx';
import ConceptFeedback from '../feedback/concept-feedback.jsx';
import Concepts from '../concepts/concepts.jsx';
import Concept from '../concepts/concept.jsx';
import Lessons from '../lessons/lessons.jsx';
import Lesson from '../lessons/lesson.jsx';
import Questions from '../questions/questions.jsx';
import Question from '../questions/question';
import ChooseModelContainer from '../questions/chooseModelContainer.jsx';
import TitleCards from '../titleCards/titleCards.tsx';
import TitleCardForm from '../titleCards/titleCardForm.tsx';
import ShowTitleCard from '../titleCards/showTitleCard.tsx';
import FillInBlankQuestions from '../fillInBlank/fillInBlankQuestions.jsx';
import TestFillInBlankQuestionContainer from '../fillInBlank/testFillInBlankQuestionContainer.jsx';
import FillInBlankQuestion from '../fillInBlank/fillInBlankQuestion.jsx';
import NewFillInBlank from '../fillInBlank/newFillInBlank';
import SentenceFragments from '../sentenceFragments/sentenceFragments.jsx';
import NewSentenceFragment from '../sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from 'components/sentenceFragments/sentenceFragment.jsx';
import TestSentenceFragmentContainer from '../sentenceFragments/testSentenceFragmentContainer.jsx';
import ChooseModelContainer from '../sentenceFragments/chooseModelContainer.jsx';
const usersEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/users.json`;
const newSessionEndpoint = `${process.env.EMPIRICAL_BASE_URL}/session/new`;

const TabLink = props => {
  const { children, to } = props
  return (<li>
    <NavLink activeClassName="is-active" to={to}>{children}</NavLink>
  </li>)
};

class adminContainer extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    this.handleAuthCheck();
    dispatch(userActions.firebaseAuth());
    dispatch(conceptActions.startListeningToConcepts());
    dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    dispatch(questionActions.startListeningToQuestions());
    dispatch(fillInBlankActions.startListeningToQuestions());
    dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    dispatch(titleCardActions.startListeningToTitleCards())
    dispatch(diagnosticLessonActions.loadDiagnosticLessons())
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
        </Switch>
      </div>
    );
  }
}

function select(state) {
  return {
  };
}

export default withRouter(connect(select)(adminContainer));
