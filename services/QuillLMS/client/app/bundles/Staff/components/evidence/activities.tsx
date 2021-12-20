import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import Navigation from './navigation';

import { ActivityInterface } from '../../interfaces/evidenceInterfaces';
import { fetchActivities } from '../../utils/evidence/activityAPIs';
import { DataTable, Error, Spinner, FlagDropdown, } from '../../../Shared/index';
import { getCheckIcon, renderErrorsContainer } from "../../helpers/evidence";

const Activities = ({ location, match }) => {

  // cache activity data for updates
  const { data: activitiesData } = useQuery("activities", fetchActivities);
  const [errors, setErrors] = React.useState<string[]>([])
  const [flag, setFlag] = React.useState<string>('alpha')

  const filteredActivities = activitiesData && activitiesData.activities && activitiesData.activities.filter(act => flag === 'All Flags' || act.flag === flag) || []

  const formattedRows = filteredActivities.map((activity: ActivityInterface) => {
    const { id, title, invalid_highlights } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    const highlightLabel = (<Link to={`/activities/${id}`}>{getCheckIcon(!(invalid_highlights && invalid_highlights.length))}</Link>);
    return {
      id,
      title: activityLink,
      valid_highlights: highlightLabel
    }
  });

  function onFlagChange(e) { setFlag(e.target.value) }

  if(!activitiesData) {
    return(
      <React.Fragment>
        <Navigation location={location} match={match} />
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      </React.Fragment>
    );
  }

  if(activitiesData.error) {
    return(
      <div className="error-container">
        <Error error={`${activitiesData.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Title", attribute:"title", width: "800px" },
    { name: "Highlight Validation", attribute:"valid_highlights", width: "100px" }
  ];

  return(<React.Fragment>
    <Navigation location={location} match={match} />
    {errors && renderErrorsContainer(false, errors)}
    <div className="activities-container">
      <FlagDropdown flag={flag} handleFlagChange={onFlagChange} isLessons={true} />
      <DataTable
        className="activities-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </div>
  </React.Fragment>);
}

export default Activities
