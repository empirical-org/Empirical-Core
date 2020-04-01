import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
import CloneConnectQuestions from '../cloneConnect/cloneConnectQuestions.tsx';
import ConceptsFeedback from '../feedback/concepts-feedback.jsx';
import ConceptFeedback from '../feedback/concept-feedback.jsx';
import Concepts from '../concepts/concepts.jsx';
import Concept from '../concepts/concept.jsx';
import ScoreAnalysis from '../scoreAnalysis/scoreAnalysis.jsx';
import Diagnostics from '../diagnostics/diagnostics.jsx';
import NewDiagnostic from '../diagnostics/new.jsx';
import Lessons from '../lessons/lessons.jsx';
import Lesson from '../lessons/lesson.jsx';
import LessonResults from '../lessons/lessonResults.jsx';
import QuestionHealth from '../questionHealth/questionHealth.jsx';
import Questions from '../questions/questions.jsx';
import Question from '../questions/question';
import ChooseModelContainer from '../questions/chooseModelContainer.jsx';
import TitleCards from '../titleCards/titleCards.tsx';
import TitleCardForm from '../titleCards/titleCardForm.tsx';
import ShowTitleCard from '../titleCards/showTitleCard.tsx';
import ItemLevel from '../itemLevels/itemLevel.jsx';
import ItemLevels from '../itemLevels/itemLevels.jsx';
import ItemLevelDetails from '../itemLevels/itemLevelDetails.jsx';
import ItemLevelForm from '../itemLevels/itemLevelForm.jsx';
import FillInBlankQuestions from '../fillInBlank/fillInBlankQuestions.jsx';
import TestFillInBlankQuestionContainer from '../fillInBlank/testFillInBlankQuestionContainer.jsx';
import FillInBlankQuestion from '../fillInBlank/fillInBlankQuestion.jsx';
import AnswerVisualizer from 'components/misc/answerVisualizer.jsx';
import NewFillInBlank from '../fillInBlank/newFillInBlank';
import SentenceFragments from '../sentenceFragments/sentenceFragments.jsx';
import NewSentenceFragment from '../sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from 'components/sentenceFragments/sentenceFragment.jsx';
import TestSentenceFragmentContainer from '../sentenceFragments/testSentenceFragmentContainer.jsx';
import ChooseModelContainer from '../sentenceFragments/chooseModelContainer.jsx';
import DiagnosticRouter from '../shared/diagnosticRouter.tsx';
const usersEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/users.json`;
const newSessionEndpoint = `${process.env.EMPIRICAL_BASE_URL}/session/new`;

const TabLink = props => (
  <li>
    <Link activeClassName="is-active" to={props.to}>{props.children}</Link>
  </li>
);

class Admin extends React.Component {
  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;
    dispatch(userActions.firebaseAuth());
    dispatch(conceptActions.startListeningToConcepts());
    dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    dispatch(questionActions.loadQuestions());
    dispatch(fillInBlankActions.startListeningToQuestions());
    dispatch(diagnosticQuestionActions.startListeningToDiagnosticQuestions());
    dispatch(sentenceFragmentActions.startListeningToSentenceFragments());
    dispatch(levelActions.startListeningToItemLevels());
    dispatch(titleCardActions.startListeningToTitleCards());
    dispatch(connectSentenceCombiningActions.startListeningToConnectQuestions())
    dispatch(connectFillInBlankActions.startListeningToConnectFillInBlankQuestions())
    dispatch(connectSentenceFragmentActions.startListeningToConnectSentenceFragments())
  }

  componentDidMount() {
    this.handleAuthCheck();
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
      <div style={{ display: 'flex', backgroundColor: "white"}}>
        <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0, }}>
          <aside className="admin-menu">
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
              <TabLink activeClassName="is-active" to={'/admin/concepts-feedback'}>Concept Feedback</TabLink>
              <TabLink activeClassName="is-active" to={'/admin/item-levels'}>Item Levels</TabLink>
            </ul>
            <p className="menu-label">
              Title Cards
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/title-cards'}>Title Cards</TabLink>
            </ul>
          </aside>
        </section>
        <Switch>
          <Route component={ConceptFeedback} path={`/admin/concepts-feedback/:conceptFeedbackID`} />
          <Route component={ConceptsFeedback} path={`/admin/concepts-feedback`} />
          <Route component={Concept} path={`/admin/concepts/:conceptID`} />
          <Route component={Concepts} path={`/admin/concepts`} />
          <Route component={CloneConnectQuestions} path={`/admin/clone_questions`} />
          <Route component={ScoreAnalysis} path={`/admin/datadash`} />
          <Route component={NewDiagnostic} path={`/admin/diagnostics/new`} />
          <Route component={Diagnostics} path={`/admin/diagnostics`} />
          <Route component={LessonResults} path={`/admin/lessons/:lessonID/results`} />
          <Route component={Lesson} path={`/admin/lessons/:lessonID`} />
          <Route component={Lessons} path={`/admin/lessons`} />
          <Route component={QuestionHealth} path={`/admin/question-health`} />
          <Route component={Question} path={`/admin/questions/:questionID`} />
          <Route component={AnswerVisualizer} path={`/admin/questions/visualize`} />
          <Route component={Questions} path={`/admin/questions`} />
          <Route component={TitleCardForm} path={`/admin/title-cards/new`} />
          <Route component={TitleCardForm} path={`/admin/title-cards/:titleCardID/edit`} />
          <Route component={ShowTitleCard} path={`/admin/title-cards/:titleCardID`} />
          <Route component={TitleCards} path={`/admin/title-cards`} />
          <Route component={ItemLevelForm} path={`/admin/item-levels/:itemLevelID/new`} />
          <Route component={ItemLevel} path={`/admin/item-levels/:itemLevelID/edit`} />
          <Route component={ItemLevelDetails} path={`/admin/item-levels/:itemLevelID`} />
          <Route component={ItemLevels} path={`/admin/item-levels`} />
          <Route component={NewFillInBlank} path={`/admin/fill-in-the-blanks/new`} />
          <Route component={FillInBlankQuestion} path={`/admin/fill-in-the-blanks/:questionID`} />
          <Route component={TestFillInBlankQuestionContainer} path={`/admin/fill-in-the-blanks/test`} />
          <Route component={FillInBlankQuestions} path={`/admin/fill-in-the-blanks`} />
          <Route component={NewSentenceFragment} path={`/admin/sentence-fragments/new`} />
          <Route component={SentenceFragment} path={`/admin/sentence-fragments/:questionID`} />
          <Route component={ChooseModelContainer} path={`/admin/sentence-fragments/choose-model`} />
          <Route component={TestSentenceFragmentContainer} path={`/admin/sentence-fragments/test`} />
          <Route component={SentenceFragments} path={`/admin/sentence-fragments`} />
          <Route component={DiagnosticRouter} path={`/play/diagnostic/:diagnosticID`} />
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

