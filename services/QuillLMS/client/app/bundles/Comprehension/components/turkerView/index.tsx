import * as React from "react";
import { connect } from "react-redux";

import TurkLanding from './landing';
import TurkCompleted from './completed';

import StudentView from '../studentView/container';

export const TurkerView = ({ session }) => {
  const { sessionID } = session;
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
      {activityStarted && !activityCompleted && <StudentView handleFinishActivity={handleFinishActivity} isTurk={true} />}
      {activityCompleted && <TurkCompleted code={sessionID} />}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    session: state.session
  };
};

export default connect(mapStateToProps, {})(TurkerView);
