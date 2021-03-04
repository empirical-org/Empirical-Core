import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { Error, Spinner } from '../../../../Shared/index';

const SemanticRulesIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function renderTitle({ activity }) {
    if(!activity) {
      return;
    }
    const { title } = activity;
    return <h2>{title}</h2>
  }

  const ruleData = { error: null };

  if(!ruleData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  return(
    <div className="semantic-rules-container">
      <div className="header-container">
        {activityData && renderTitle(activityData)}
      </div>
    </div>
  );
}

export default SemanticRulesIndex
