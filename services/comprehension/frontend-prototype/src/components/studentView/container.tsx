import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";

import getParameterByName from '../../helpers/getParameterByName'

import { getActivity } from "../../actions/activities";

interface StudentViewContainerProps {
  dispatch: Function;
  activities: any;
}

interface StudentViewContainerState {

}

class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  constructor(props: StudentViewContainerProps) {
    super(props)
  }

  componentWillMount() {
    const activityUID = getParameterByName('uid', window.location.href)

    if (activityUID) {
      this.props.dispatch(getActivity(activityUID))
    }
  }

  render() {
    const { currentActivity, hasReceivedData, } = this.props.activities
    if (hasReceivedData) {
      return <div className="activity-container">
        <div className="passage-container">
          <p className="directions">Read the passage</p>
          <h1 className="title">{currentActivity.title}</h1>
          <div className="passage">
            {currentActivity.passages}
          </div>
        </div>
        <div className="steps-container">
        </div>
      </div>
    } else {
      return 'Loading'
    }
  }


}

const mapStateToProps = (state: any) => {
  return {
    activities: state.activities
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentViewContainer);
