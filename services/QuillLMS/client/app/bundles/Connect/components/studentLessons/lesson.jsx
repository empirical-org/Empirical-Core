import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PlayLessonQuestion from './question';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx'
import {
  PlayTitleCard,
  Register,
  Spinner,
  ProgressBar
} from 'quill-component-library/dist/componentLibrary'
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';
import SessionActions from '../../actions/sessions.js';
import _ from 'underscore';
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../libs/conceptResults/lesson';
import Finished from './finished.jsx';
import { getParameterByName } from '../../libs/getParameterByName';
import { permittedFlag } from '../../libs/flagArray'
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'

const request = require('request');

export class Lesson extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasOrIsGettingResponses: false,
      sessionInitialized: false
    }
  }

  componentDidMount() {
    const { dispatch, } = this.props
    dispatch(clearData());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { playLesson, } = this.props
    const answeredQuestionsHasChanged = nextProps.playLesson.answeredQuestions.length !== playLesson.answeredQuestions.length
    const nextPropsAttemptsLength = nextProps.playLesson.currentQuestion && nextProps.playLesson.currentQuestion.question ? nextProps.playLesson.currentQuestion.question.attempts.length : 0
    const thisPropsAttemptsLength = playLesson.currentQuestion && playLesson.currentQuestion.question ? playLesson.currentQuestion.question.attempts.length : 0
    const attemptsHasChanged = nextPropsAttemptsLength !== thisPropsAttemptsLength
    if (answeredQuestionsHasChanged || attemptsHasChanged) {
      this.saveSessionData(nextProps.playLesson);
    }
  }

  componentDidUpdate() {
    const { sessionInitialized, } = this.state
    const { questions, fillInBlank, sentenceFragments, titleCards, } = this.props
    // At mount time the component may still be waiting on questions
    // to be retrieved, so we need to do checks on component update
    if (questions.hasreceiveddata &&
        fillInBlank.hasreceiveddata &&
        sentenceFragments.hasreceiveddata &&
        titleCards.hasreceiveddata) {
      // This function will bail early if it has already set question data
      // so it is safe to call repeatedly
      SessionActions.populateQuestions("SC", questions.data);
      SessionActions.populateQuestions("FB", fillInBlank.data);
      SessionActions.populateQuestions("SF", sentenceFragments.data);
      SessionActions.populateQuestions("TL", titleCards.data);
      // This used to be an DidMount call, but we can't safely call it
      // until the Session module has received Question data, so now
      // we check if the value has been initalized, and if not we do so now
      if (!sessionInitialized) {
        this.saveSessionIdToState();
      }
    }
  }

  getLesson = () => {
    const { lessons, match } = this.props
    const { data } = lessons
    const { params } = match
    const { lessonID } = params
    return data[lessonID];
  }

  createAnonActivitySession = (lessonID, results, score) => {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/`,
        method: 'POST',
        json:
        {
          state: 'finished',
          activity_uid: lessonID,
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
          this.setState({ saved: true, });
        }
      }
    );
  }

  finishActivitySession = (sessionID, results, score) => {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${sessionID}`,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          SessionActions.delete(sessionID);
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${sessionID}`;
          this.setState({ saved: true, });
        } else {
          this.setState({
            saved: false,
            error: body.meta.message,
          });
        }
      }
    );
  }

  hasQuestionsInQuestionSet = (props) => {
    const pL = props.playLesson;
    return (pL && pL.questionSet && pL.questionSet.length);
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, } = this.props
    const next = nextQuestion();
    return dispatch(next);
  }

  questionsForLesson = () => {
    const { match, lessons } = this.props
    const { data, } = lessons
    const { params, } = match
    const { lessonID, } = params;
    const filteredQuestions = data[lessonID].questions.filter((ques) => {
      const question = this.props[ques.questionType].data[ques.key] // eslint-disable-line react/destructuring-assignment
      return question && permittedFlag(data[lessonID].flag, question.flag)
    }
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];  // eslint-disable-line react/destructuring-assignment
      question.key = key;
      let type
      switch (questionType) {
        case 'questions':
          type = 'SC'
          break
        case 'fillInBlank':
          type = 'FB'
          break
        case 'titleCards':
          type = 'TL'
          break
        case 'sentenceFragments':
        default:
          type = 'SF'
      }
      return { type, question, };
    });
  }

  resumeSession = (data) => {
    const { dispatch, } = this.props
    if (data) {
      dispatch(resumePreviousSession(data));
    }
  }

  saveSessionData = (lessonData) => {
    const { sessionID, } = this.state
    if (sessionID) {
      SessionActions.update(sessionID, lessonData);
    }
  }

  saveSessionIdToState = () => {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    this.setState({ sessionID, sessionInitialized: true}, () => {
      if (sessionID) {
        SessionActions.get(sessionID, (data) => {
          this.setState({ session: data, });
        });
      }
    });
  }

  saveToLMS = () => {
    const { playLesson, match } = this.props
    const { params } = match
    const { sessionID, } = this.state
    const { lessonID, } = params;
    this.setState({ error: false, });
    const relevantAnsweredQuestions = playLesson.answeredQuestions.filter(q => q.questionType !== 'TL')
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
    const score = calculateScoreForLesson(relevantAnsweredQuestions);
    if (sessionID) {
      this.finishActivitySession(sessionID, results, score);
    } else {
      this.createAnonActivitySession(lessonID, results, score);
    }
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    const action = submitResponse(response);
    dispatch(action);
  }

  renderProgressBar = () => {
    const { playLesson, } = this.props
    if (!playLesson.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playLesson)

    const currentQuestionIsTitleCard = playLesson.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0

    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    return (<ProgressBar
      answeredQuestionCount={displayedAnsweredQuestionCount}
      label='questions'
      percent={getProgressPercent(playLesson)}
      questionCount={questionCount(playLesson)}
    />)
  }

  render() {
    const { sessionInitialized, error, sessionID, saved, session, } = this.state
    const { conceptsFeedback, playLesson, dispatch, lessons, match } = this.props
    const { data, hasreceiveddata, } = lessons
    const { params } = match
    const { lessonID, } = params;
    let component;

    if (!(sessionInitialized && hasreceiveddata && data && data[lessonID])) {
      return (<div className="student-container student-container-diagnostic"><Spinner /></div>);
    }

    if (playLesson.currentQuestion) {
      const { type, question, } = playLesson.currentQuestion;
      if (type === 'SF') {
        component = (
          <PlaySentenceFragment
            conceptsFeedback={conceptsFeedback}
            currentKey={question.key}
            dispatch={dispatch}
            key={question.key}
            markIdentify={this.markIdentify}
            marking="diagnostic"
            nextQuestion={this.nextQuestion}
            question={question}
            updateAttempts={this.submitResponse}
          />
        );
      } else if (type === 'FB') {
        component = (
          <PlayFillInTheBlankQuestion
            conceptsFeedback={conceptsFeedback}
            dispatch={dispatch}
            key={question.key}
            nextQuestion={this.nextQuestion}
            prefill={this.getLesson().prefill}
            question={question}
            submitResponse={this.submitResponse}
          />
        );
      } else if (type === 'TL'){
        component = (
          <PlayTitleCard
            data={question}
            handleContinueClick={this.nextQuestion}
          />
        )
      } else {
        component = (
          <PlayLessonQuestion
            conceptsFeedback={conceptsFeedback}
            dispatch={dispatch}
            isAdmin={false}
            key={question.key}
            nextQuestion={this.nextQuestion}
            prefill={this.getLesson().prefill}
            question={question}
          />
        );
      }
    } else if (playLesson.answeredQuestions.length > 0 && (playLesson.unansweredQuestions.length === 0 && playLesson.currentQuestion === undefined)) {
      component = (
        <Finished
          data={playLesson}
          error={error}
          lessonID={params.lessonID}
          name={sessionID}
          saved={saved}
          saveToLMS={this.saveToLMS}
        />
      );
    } else {
      component = (
        <Register lesson={this.getLesson()} resumeActivity={this.resumeSession} session={session} startActivity={this.startActivity} />
      );
    }

    return (
      <div>
        <section className="section is-fullheight minus-nav student">
          {this.renderProgressBar()}
          <div className="student-container student-container-diagnostic">
            {component}
          </div>
        </section>
      </div>
    );
  }
}

function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    sentenceFragments: state.sentenceFragments,
    playLesson: state.playLesson, // the questionReducer
    routing: state.routing,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards,
    conceptsFeedback: state.conceptsFeedback
  };
}

export default withRouter(connect(select)(Lesson));
