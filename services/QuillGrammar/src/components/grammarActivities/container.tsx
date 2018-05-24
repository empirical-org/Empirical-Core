import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import request from 'request';
import getParameterByName from '../../helpers/getParameterByName';
import { startListeningToActivity } from "../../actions/grammarActivities";
import { startListeningToQuestions, goToNextQuestion, checkAnswer } from "../../actions/questions";
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import Question from './question'

class PlayGrammarContainer extends React.Component<any, any> {
    constructor(props: any) {
      super(props);

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      this.props.dispatch(startListeningToActivity(activityUID))
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.grammarActivities.hasreceiveddata && !nextProps.questions.hasreceiveddata && !nextProps.questions.error) {
        const concepts = nextProps.grammarActivities.currentActivity.concepts
        this.props.dispatch(startListeningToQuestions(concepts))
      }
      if (nextProps.questions.hasreceiveddata && !nextProps.questions.currentQuestion && nextProps.questions.unansweredQuestions.length === 0 && nextProps.questions.answeredQuestions.length > 0) {
        this.saveToLMS(nextProps.questions)
      } else if (nextProps.questions.hasreceiveddata && !nextProps.questions.currentQuestion) {
        console.log('nextProps.questions', nextProps.questions)
        this.props.dispatch(goToNextQuestion())
      }
    }

    saveToLMS(questions) {
      this.setState({ error: false, });
      const results = getConceptResultsForAllQuestions(questions.answeredQuestions);
      console.log('results', results);
      const score = calculateScoreForLesson(questions.answeredQuestions);
      console.log('score', score)
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      debugger;
      if (sessionID) {
        this.finishActivitySession(sessionID, results, score);
      } else {
        this.createAnonActivitySession(activityUID, results, score);
      }
    }

    finishActivitySession(sessionID, results, score) {
      request(
        { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${sessionID}`,
          method: 'PUT',
          json:
          {
            state: 'finished',
            concept_results: results,
            percentage: score,
          },
        },
        (err, httpResponse, body) => {
          if (httpResponse && httpResponse.statusCode === 200) {
            console.log('Finished Saving');
            console.log(err, httpResponse, body);
            const sessionID = getParameterByName('student', window.location.href)
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${sessionID}`;
            this.setState({ saved: true, });
          } else {
            this.setState({
              saved: false,
              error: true,
            });
          }
        }
      );
    }

    createAnonActivitySession(lessonID, results, score) {
      request(
        { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/`,
          method: 'POST',
          json:
          {
            state: 'finished',
            activity_uid: lessonID,
            concept_results: results,
            percentage: score,
          },
        },
        (err, httpResponse, body) => {
          if (httpResponse.statusCode === 200) {
            console.log('Finished Saving');
            console.log(err, httpResponse, body);
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
            this.setState({ saved: true, });
          }
        }
      );
    }

    render(): JSX.Element {
      if (this.props.grammarActivities.hasreceiveddata && this.props.questions.hasreceiveddata && this.props.questions.currentQuestion) {
        return <Question
          activity={this.props.grammarActivities.currentActivity}
          answeredQuestions={this.props.questions.answeredQuestions}
          unansweredQuestions={this.props.questions.unansweredQuestions}
          currentQuestion={this.props.questions.currentQuestion}
          goToNextQuestion={() => this.props.dispatch(goToNextQuestion())}
          checkAnswer={(response, question) => this.props.dispatch(checkAnswer(response, question))}
        />
      } else if (this.props.questions.error) {
        return (
          <div>{this.props.questions.error}</div>
        );
      } else {
        return <div>Loading...</div>
      }
    }
}

const mapStateToProps = (state: any) => {
    return {
        grammarActivities: state.grammarActivities,
        questions: state.questions
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayGrammarContainer);
