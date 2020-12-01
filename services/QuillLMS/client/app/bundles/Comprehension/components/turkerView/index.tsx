import * as React from "react";
import { connect } from "react-redux";

import TurkLanding from './landing';
import TurkCompleted from './completed';

import StudentView from '../studentView/container';

export const TurkerView = ({ session }) => {
  const { sessionID } = session;
  const [activityStarted, setActivityStarted] = React.useState<boolean>(false);
  const [activityCompleted, setActivityCompleted] = React.useState<boolean>(false);

  function handleStartActivity() {
    setActivityStarted(true);
  }

  function handleFinishActivity() {
    setActivityCompleted(true);
  }

  function componentToShow() {
    if (!activityStarted) { return <TurkLanding handleStartActivity={handleStartActivity} /> }

    if (activityStarted && !activityCompleted) { return <StudentView handleFinishActivity={handleFinishActivity} isTurk={true} />}

    return <TurkCompleted code={sessionID} />
 }

  return(
    <div className="turker-view-container">
      {componentToShow()}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    session: state.session
  };
};

export default connect(mapStateToProps, {})(TurkerView);
