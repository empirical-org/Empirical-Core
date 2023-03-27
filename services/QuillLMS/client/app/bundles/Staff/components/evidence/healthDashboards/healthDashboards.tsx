import * as React from "react";

import ActivityHealthDashboard from "./activityHealthDashboard";
import PromptHealthDashboard from "./promptHealthDashboard";

import Navigation from '../navigation';

const HealthDashboards = ({ location, match }) => {
  const [showActivities, setShowActivities] = React.useState<boolean>(true);

  function renderDashboard() {
    if(showActivities) {
      return <ActivityHealthDashboard handleDashboardToggle={handleDashboardToggle} />
    }
    return <PromptHealthDashboard handleDashboardToggle={handleDashboardToggle} />
  }

  const handleDashboardToggle = () => {
    setShowActivities(!showActivities)
  }

  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="health-dashboards-index-container">
        {renderDashboard()}
      </div>
    </React.Fragment>
  );
}

export default HealthDashboards
