import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import Admin from '../components/admin/admin.jsx';
import ConceptsFeedback from '../components/feedback/concepts-feedback.jsx';
import ConceptFeedback from '../components/feedback/concept-feedback.jsx';
import Concepts from '../components/concepts/concepts.jsx';
import Concept from '../components/concepts/concept.jsx';
import ScoreAnalysis from '../components/scoreAnalysis/scoreAnalysis.jsx';
import Questions from '../components/questions/questions.jsx';
import Question from '../components/questions/question.jsx';
import ResponseComponentWrapper from '../components/questions/responseRouteWrapper.jsx';
import DiagnosticQuestions from '../components/diagnosticQuestions/diagnosticQuestions.jsx';
import NewDiagnosticQuestions from '../components/diagnosticQuestions/newDiagnosticQuestion.jsx'
import DiagnosticQuestion from '../components/diagnosticQuestions/diagnosticQuestion.jsx';
import SentenceFragments from '../components/sentenceFragments/sentenceFragments.jsx';
import NewSentenceFragment from '../components/sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from '../components/sentenceFragments/sentenceFragment.jsx';
import Lessons from '../components/lessons/lessons.jsx';
import Lesson from '../components/lessons/lesson.jsx';
import LessonResults from '../components/lessons/lessonResults.jsx';
import Diagnostics from '../components/diagnostics/diagnostics.jsx';
import NewDiagnostic from '../components/diagnostics/new.jsx';
import ItemLevels from '../components/itemLevels/itemLevels.jsx';
import ItemLevel from '../components/itemLevels/itemLevel.jsx';
import ItemLevelForm from '../components/itemLevels/itemLevelForm.jsx';
import ItemLevelDetails from '../components/itemLevels/itemLevelDetails.jsx';
import FocusPointsContainer from '../components/focusPoints/focusPointsContainer.jsx';
import EditFocusPointsContainer from '../components/focusPoints/editFocusPointsContainer.jsx';
import NewFocusPointsContainer from '../components/focusPoints/newFocusPointsContainer.jsx';
import IncorrectSequenceContainer from '../components/incorrectSequence/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from '../components/incorrectSequence/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from '../components/incorrectSequence/newIncorrectSequenceContainer.jsx';
import TestQuestionContainer from '../components/questions/testQuestion.jsx';
import ChooseModelContainer from '../components/questions/chooseModelContainer.jsx';
import AnswerVisualizer from '../components/misc/answerVisualizer.jsx';
import FillInBlankQuestions from '../components/fillInBlank/fillInBlankQuestions.jsx';
import NewFillInBlank from '../components/fillInBlank/newFillInBlank.jsx';
import EditFillInBlank from '../components/fillInBlank/editFillInBlank.jsx';
import FillInBlankQuestion from '../components/fillInBlank/fillInBlankQuestion.jsx';
import TestFillInBlankQuestionContainer from '../components/fillInBlank/testFillInBlankQuestionContainer.jsx';
import MassEditContainer from '../components/questions/MassEditContainer.jsx';

const AdminRoutes = (
  <Route path="/admin" component={Admin}>
    {/* concepts section*/}
    {/* <Route path="concepts" component={Concepts} />
    <Route path="concepts/:conceptID" component={Concept} /> */}

    {/* questions section*/}
    {/* <Route path="questions" component={Questions} />
    <Route path="questions/:questionID" component={Question}>
      {/* <IndexRedirect to="/admin/questions/:questionID/responses" /> */}
      {/* <Route path="responses" component={ResponseComponentWrapper} /> */}
      {/* <Route path="choose-model" component={ChooseModelContainer} /> */}
      {/* <Route path="focus-points" component={FocusPointsContainer} />
      <Route path="focus-points/:focusPointID/edit" component={EditFocusPointsContainer} />
      <Route path="focus-points/new" component={NewFocusPointsContainer} />
      <Route path="incorrect-sequences" component={IncorrectSequenceContainer} />
      <Route path="incorrect-sequences/:incorrectSequenceID/edit" component={EditIncorrectSequenceContainer} />
      <Route path="incorrect-sequences/new" component={NewIncorrectSequenceContainer} />
      <Route path="test" component={TestQuestionContainer} /> */}
      {/* <Route path="visualize" component={AnswerVisualizer} /> */}
      {/* <Route path="mass-edit" component={MassEditContainer} /> */}
    </Route> */}

    {/* fill in the blanks section*/}
    // <Route path="fill-in-the-blanks" component={FillInBlankQuestions} />
    // <Route path="fill-in-the-blanks/new" component={NewFillInBlank} />
    // <Route path="fill-in-the-blanks/:questionID" component={FillInBlankQuestion}>
    //   <IndexRedirect to="/admin/fill-in-the-blanks/:questionID/responses" />
    //   <Route path="responses" component={ResponseComponentWrapper} />
    //   <Route path="edit" component={EditFillInBlank} />
    //   <Route path="test" component={TestFillInBlankQuestionContainer} />
    //   <Route path="mass-edit" component={MassEditContainer} />
    // </Route>

    {/* data section*/}
    {/* <Route path="datadash" component={ScoreAnalysis} /> */}

    {/* questions section*/}
    // <Route path="diagnostic-questions" component={DiagnosticQuestions} />
    // <Route path="diagnostic-questions/:questionID" component={DiagnosticQuestion} >
    //   <IndexRedirect to="/admin/diagnostic-questions/:questionID/responses" />
    //   <Route path="responses" component={ResponseComponentWrapper} />
    //   <Route path="mass-edit" component={MassEditContainer} />
    // </Route>

    {/* sentence Fragment sections*/}
    // <Route path="sentence-fragments" component={SentenceFragments} />
    // <Route path="sentence-fragments/new" component={NewSentenceFragment} />
    // <Route path="sentence-fragments/:questionID" component={SentenceFragment}>
    //   <IndexRedirect to="/admin/sentence-fragments/:questionID/responses" />
    //   <Route path="responses" component={ResponseComponentWrapper} />
    //   <Route path="mass-edit" component={MassEditContainer} />
    // </Route>

    {/* lessons section*/}
    // <Route path="lessons" component={Lessons} />
    // <Route path="lessons/:lessonID" component={Lesson} />
    // <Route path="lessons/:lessonID/results" component={LessonResults} />

    {/* diagnostics */}
    <Route path="diagnostics" component={Diagnostics} />
    <Route path="diagnostics/new" component={NewDiagnostic} />

    {/* targeted Feedback */}
    <Route path="concepts-feedback" component={ConceptsFeedback}>
      <Route path=":feedbackID" component={ConceptFeedback} />
    </Route>

    {/* item Levels */}
    <Route path="item-levels" component={ItemLevels} />
    <Route path="item-levels/new" component={ItemLevelForm} />
    <Route path="item-levels/:itemLevelID" component={ItemLevelDetails} />
    <Route path="item-levels/:itemLevelID/edit" component={ItemLevel} />
  </Route>
);

export default AdminRoutes;
