import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import getParameterByName from '../../helpers/getParameterByName'
import { IState } from "../../store/configStore";
import { startListeningToActivity } from "../../actions/grammarActivities";
import { startListeningToQuestions, goToNextQuestion, submitResponse } from "../../actions/questions";
import Question from './question'

class PlayGrammarContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      this.props.dispatch(startListeningToActivity(activityUID))
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.grammarActivities.hasreceiveddata && !nextProps.questions.hasreceiveddata && !nextProps.questions.error) {
        const conceptUIDs = Object.keys(nextProps.grammarActivities.currentActivity.concepts)
        this.props.dispatch(startListeningToQuestions(conceptUIDs))
      }
      if (nextProps.questions.hasreceiveddata && !nextProps.questions.currentQuestion) {
        console.log('nextProps.questions', nextProps.questions)
        this.props.dispatch(goToNextQuestion())
      }
    }

    render(): JSX.Element {
      if (this.props.grammarActivities.hasreceiveddata && this.props.questions.hasreceiveddata && this.props.questions.currentQuestion) {
        return <Question
          activity={this.props.grammarActivities.currentActivity}
          answeredQuestions={this.props.questions.answeredQuestions}
          unansweredQuestions={this.props.questions.unansweredQuestions}
          currentQuestion={this.props.questions.currentQuestion}
          goToNextQuestion={() => this.props.dispatch(goToNextQuestion())}
          submitResponse={(response) => this.props.dispatch(submitResponse(response))}
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
