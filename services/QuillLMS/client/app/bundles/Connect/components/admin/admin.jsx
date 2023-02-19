import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminLesson from './adminLesson.jsx'

import ActivityHealth from '../activityHealth/activityHealth';
import conceptActions from '../../actions/concepts';
import conceptsFeedbackActions from '../../actions/concepts-feedback';
import questionActions from '../../actions/questions';
import fillInBlankActions from '../../actions/fillInBlank';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import titleCardActions from '../../actions/titleCards.ts';
import AdminMainSidebar from '../../components/admin/adminMainSidebar.jsx'
import ConceptsFeedback from '../feedback/concepts-feedback.jsx';
import ConceptFeedback from '../feedback/concept-feedback.jsx';
import Concepts from '../concepts/concepts.jsx';
import Concept from '../concepts/concept';
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
import SentenceFragments from '../sentenceFragments/sentenceFragments.jsx';
import SentenceFragment from '../sentenceFragments/sentenceFragment.jsx';
import TestSentenceFragmentContainer from '../sentenceFragments/testSentenceFragmentContainer.jsx';
const usersEndpoint = `${import.meta.env.DEFAULT_URL}/api/v1/users.json`;
const newSessionEndpoint = `${import.meta.env.DEFAULT_URL}/session/new`;

class adminContainer extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    this.handleAuthCheck();
    dispatch(conceptActions.startListeningToConcepts());
    dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    dispatch(questionActions.startListeningToQuestions());
    dispatch(fillInBlankActions.startListeningToQuestions());
    dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    dispatch(titleCardActions.startListeningToTitleCards())
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
        <Switch>
          <Route component={AdminLesson} path='/admin/lesson-view' />
          <Route component={AdminMainSidebar} path='/admin' />
        </Switch>
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
          <Route component={TitleCardForm} path='/admin/title-cards/:titleCardID/edit' />
          <Route component={TitleCardForm} path='/admin/title-cards/new' />
          <Route component={ShowTitleCard} path='/admin/title-cards/:titleCardID' />
          <Route component={TitleCards} path='/admin/title-cards' />
          <Route component={ActivityHealth} path='/admin/activity-health' />
          <Route component={FillInBlankQuestion} path='/admin/fill-in-the-blanks/:questionID' />
          <Route component={TestFillInBlankQuestionContainer} path='/admin/fill-in-the-blanks/test' />
          <Route component={FillInBlankQuestions} path='/admin/fill-in-the-blanks' />
          <Route component={FillInBlankQuestion} path='/admin/fill-in-the-blanks/:questionID' />
          <Route component={TestFillInBlankQuestionContainer} path='/admin/fill-in-the-blanks/test' />
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
