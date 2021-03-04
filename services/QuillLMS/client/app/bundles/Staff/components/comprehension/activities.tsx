import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import Navigation from './navigation'

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { fetchActivities } from '../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../Shared/index';

const Activities = ({ location, match, type }) => {

  // cache activity data for updates
  const { data } = useQuery("activities", fetchActivities);

  const formattedRows = data && data.activities && data.activities.map((activity: ActivityInterface) => {
    const { id,  title } = activity;
    const link = type === 'sessions' ? `/activity-sessions/${id}` : `/activities/${id}`
    const activityLink = (<Link to={link}>{title}</Link>);
    return {
      id,
      title: activityLink
    }
  });

  if(!data) {
    return(
      <React.Fragment>
        <Navigation location={location} match={match} />
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      </React.Fragment>
    );
  }

  if(data.error) {
    return(
      <div className="error-container">
        <Error error={`${data.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Title", attribute:"title", width: "900px" }
  ];

  return(<React.Fragment>
    <Navigation location={location} match={match} />
    <div className="activities-container">
      <DataTable
        className="activities-table"
        defaultSortAttribute="title"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </div>
  </React.Fragment>);
}

export default Activities
