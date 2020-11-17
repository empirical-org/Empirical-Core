import * as React from "react";
import { connect } from "react-redux";

export const TurkActivity = ({ handleFinishActivity }) => {
  return(
    <div className="turk-activity-container">
      activity
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    activities: state.activities,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TurkActivity);
