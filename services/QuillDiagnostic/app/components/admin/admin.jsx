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
import TitleCards from '../titleCards/titleCards.tsx';
import TitleCardForm from '../titleCards/titleCardForm.tsx';
import ShowTitleCard from '../titleCards/showTitleCard.tsx';
import ItemLevel from '../itemLevels/itemLevel.jsx';
import ItemLevels from '../itemLevels/itemLevels.jsx';
import ItemLevelDetails from '../itemLevels/itemLevelDetails.jsx';
import ItemLevelForm from '../itemLevels/itemLevelForm.jsx';


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

  render() {
    const { children } = this.props;
    return (
      <div style={{ display: 'flex', backgroundColor: "white", height: '100vw' }}>
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
          {/* <div className="admin-container">
            {children}
          </div> */}
        </section>
        <Switch>
          <Route component={CloneConnectQuestions} path={`/admin/clone_questions`} />
          <Route component={Concept} path={`/admin/concepts/:conceptID`} />
          <Route component={Concepts} path={`/admin/concepts`} />
          <Route component={ConceptFeedback} path={`/admin/concepts_feedback/:conceptFeedbackID`} />
          <Route component={ConceptsFeedback} path={`/admin/concepts_feedback`} />
          <Route component={ScoreAnalysis} path={`/admin/datadash`} />
          <Route component={NewDiagnostic} path={`/admin/diagnostics/new`} />
          <Route component={Diagnostics} path={`/admin/diagnostics`} />
          <Route component={LessonResults} path={`/admin/lessons/:lessonID/results`} />
          <Route component={Lesson} path={`/admin/lessons/:lessonID`} />
          <Route component={Lessons} path={`/admin/lessons`} />
          <Route component={QuestionHealth} path={`/admin/question-health`} />
          <Route component={Question} path={`/admin/questions/:questionID`} />
          <Route component={Questions} path={`/admin/questions`} />
          <Route component={TitleCardForm} path={`/admin/title-cards/:titleCardID/edit`} />
          <Route component={ShowTitleCard} path={`/admin/title-cards/:titleCardID`} />
          <Route component={TitleCardForm} path={`/admin/title-cards/new`} />
          <Route component={TitleCards} path={`/admin/title-cards`} />
          <Route component={ItemLevelForm} path={`/admin/item-levels/:itemLevelID/new`} />
          <Route component={ItemLevel} path={`/admin/item-levels/:itemLevelID/edit`} />
          <Route component={ItemLevelDetails} path={`/admin/item-levels/:itemLevelID`} />
          <Route component={ItemLevels} path={`/admin/item-levels`} />
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

