import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx';
import LoadingIndicator from '../shared/loading_indicator';
import activityLaunchLink from '../modules/generate_activity_launch_link.js';

const NextActivity = ({
  hasActivities,
  loading,
  name,
  activityClassificationId,
  caId,
  maxPercentage,
  activityId
}) => {
  if (name) {
    const text = activityClassificationId === '6' ? 'Join Lesson' : 'Start Activity';
    const data = {
      percentage: maxPercentage,
      activity_classification_id: activityClassificationId,
    };

    return (
      <div className="next-activity">
        <div className="next-activity-name">
          <ActivityIconWithTooltip
            data={data}
            context={'studentProfile'}
            placement={'bottom'}
          />
          <p>
            {name}
          </p>
        </div>
        <div className="start-activity-wrapper">
          <a href={activityLaunchLink(caId, activityId)}>
            <button className="button-green pull-right">
              {text}
            </button>
          </a>
        </div>
      </div>
    );
  } else if (loading) {
    return (<LoadingIndicator />);
  } else if (hasActivities) {
    return (<span />);
  }
  return (
    <div className="container">
      <p style={{ fontSize: '18px', margin: '2em', }}>
        Your teacher hasn't assigned any activities to you yet.
      </p>
    </div>
  );
};

export default NextActivity;
