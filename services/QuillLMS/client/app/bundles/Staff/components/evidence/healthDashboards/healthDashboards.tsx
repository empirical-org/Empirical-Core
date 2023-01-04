import * as React from "react";

import Navigation from '../navigation'
import ActivityHealthDashboard from "./activityHealthDashboard";
import PromptHealthDashboard from "./promptHealthDashboard";

const HealthDashboards = ({ location, match }) => {
  const [showActivities, setShowActivities] = React.useState<boolean>(true);

  const handleDashboardToggle = () => {
    setShowActivities(!showActivities)
  }

  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="health-dashboards-index-container">
        {showActivities ? <ActivityHealthDashboard handleDashboardToggle={handleDashboardToggle} /> : <PromptHealthDashboard handleDashboardToggle={handleDashboardToggle} />}
      </div>
    </React.Fragment>
  );
}

export default HealthDashboards
