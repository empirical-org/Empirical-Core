import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import getParameterByName from '../../helpers/getParameterByName'
import { IState } from "../../store/configStore";
import { startListeningToActivity } from "../../actions/grammarActivities";

class PlayGrammarContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      this.props.dispatch(startListeningToActivity(activityUID))
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
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayGrammarContainer);
