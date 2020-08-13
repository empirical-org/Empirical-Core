import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import { getActivity } from "../../actions/grammarActivities";
import getParameterByName from "../../helpers/getParameterByName";

export interface ActivityPreviewProps {
  activity: { title: string };
  dispatch: Function;
  onTogglePreview: () => void;
  onToggleQuestion: (question: object) => void;
  questions: object;
  showPreview: boolean;
}
 
const ActivityPreview = ({ activity, dispatch, onTogglePreview, onToggleQuestion, questions, showPreview }: ActivityPreviewProps) => {

  React.useEffect(() => {  
    const activityUID = getParameterByName('uid', window.location.href);
    if (activityUID) {
      dispatch(getActivity(activityUID))
    }
  }, []);

  return (
    <div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
      activity: state.grammarActivities ? state.grammarActivities.currentActivity : null,
      questions: state.questions.data
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
      dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPreview);
