import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import Navigation from './navigation'

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { fetchActivities } from '../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../Shared/index';

const Activities = ({ location, match, }) => {

  // cache activity data for updates
  const { data } = useQuery("activities", fetchActivities);

  const formattedRows = data && data.activities && data.activities.map((activity: ActivityInterface) => {
    const { id,  name, } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{name}</Link>);
    return {
      id,
      name: activityLink
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
    { name: "Name", attribute:"name", width: "900px" }
  ];

  return(<React.Fragment>
    <Navigation location={location} match={match} />
    <div className="activities-container">
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
