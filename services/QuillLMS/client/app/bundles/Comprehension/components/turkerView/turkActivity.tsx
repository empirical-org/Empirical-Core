import * as React from "react";
import queryString from 'query-string';
import { connect } from "react-redux";

import { getActivity } from "../../actions/activities";

export const TurkActivity = (props) => {
  const [showFocusState, setShowFocusState] = React.useState<boolean>(false);

  React.useEffect(() => {
    const { dispatch, session, location } = props
    const { sessionID } = session
    const activityUID = location && location.search ? queryString.parse(location.search).uid : null;

    if (activityUID) {
      dispatch(getActivity(sessionID, activityUID))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  });

  function handleKeyDown(e: any) {
    if (e.key !== 'Tab' || showFocusState) { return }
    setShowFocusState(true);
  }

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
