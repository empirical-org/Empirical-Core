import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import getParameterByName from '../../helpers/getParameterByName'
import { IState } from "../../store/configStore";
import { startListeningToActivity } from "../../actions/grammarActivities";
import { startListeningToQuestions } from "../../actions/questions";
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
    }

    render(): JSX.Element {
      if (this.props.grammarActivities.hasreceiveddata && this.props.questions.hasreceiveddata) {
        return <Question activity={this.props.grammarActivities.currentActivity} questions={this.props.questions.currentQuestions}/>
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
