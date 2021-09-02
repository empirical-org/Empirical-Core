import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter } from 'react-router-dom';

import ActivitySettings from './activitySettings';

import { ActivityInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { blankActivity } from '../../../../../constants/evidence';
import { Spinner } from '../../../../Shared/index';

const ActivitySettingsWrapper = ({ match }) => {
  const { params } = match;
  const { activityId} = params;

  let activity: ActivityInterface;

  if(!activityId) {
    activity = blankActivity
  } else {
    const { data: activityData } = useQuery({
      queryKey: [`activity-${activityId}`, activityId],
      queryFn: fetchActivity
    });
    activity = activityData && activityData.activity;
  }

  if(!activity) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <ActivitySettings activity={activity} />
  );
}

export default withRouter<any, any>(ActivitySettingsWrapper)
