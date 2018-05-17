import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import getParameterByName from '../../helpers/getParameterByName'
import { IState } from "../../store/configStore";
import { startListeningToActivity } from "../../actions/grammarActivities";
import { startListeningToQuestions } from "../../actions/questions";

class PlayGrammarContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      this.props.dispatch(startListeningToActivity(activityUID))
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.grammarActivities.hasreceiveddata) {
        Object.keys(nextProps.grammarActivities.currentActivity.concepts).forEach(conceptUID => {
          this.props.dispatch(startListeningToQuestions(conceptUID))
        })
      }
    }

    render(): JSX.Element {
        return (
            <div>Stuff will go here</div>
        );
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
