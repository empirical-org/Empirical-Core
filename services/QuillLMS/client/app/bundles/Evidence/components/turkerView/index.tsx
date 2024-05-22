import queryString from 'query-string';
import * as React from "react";
import { connect } from "react-redux";

import TurkCompleted from './completed';
import TurkLanding from './landing';

import validateTurkSession from '../../utils/turkAPI';
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

  function redirectIfInvalid(isValid) {
    if (!isValid) {
      window.location.href = `${process.env.DEFAULT_URL}/404`
    }
  }

  function validateUrl() {
    const search = window.location.href.split('?').pop()
    if (!search) { return }

    validateTurkSession(queryString.parse(search).id, queryString.parse(search).uid, redirectIfInvalid)
  }

  function componentToShow() {
    validateUrl()

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
