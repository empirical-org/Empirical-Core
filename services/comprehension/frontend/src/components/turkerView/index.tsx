import * as React from "react";
import { connect } from "react-redux";
import TurkLanding from './landing';
import TurkActivity from './turkActivity';
import TurkCompleted from './completed';

export const TurkerView = () => {
  const [activityStarted, setActivityStarted] = React.useState<boolean>(false);
  const [activityCompleted, setActivityCompleted] = React.useState<boolean>(false);

  const handleStartActivity = () => {
    setActivityStarted(true);
  }

  const handleFinishActivity = () => {
    setActivityCompleted(true);
  }

  return(
    <div className="turker-view-container">
      {!activityStarted && <TurkLanding handleStartActivity={handleStartActivity} />}
      {activityStarted && !activityCompleted && <TurkActivity handleFinishActivity={handleFinishActivity} />}
      {activityCompleted && <TurkCompleted />}
    </div>
  )
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

export default connect(mapStateToProps, mapDispatchToProps)(TurkerView);
