import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { fetchActivities } from '../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../Shared/index';

const Activities = () => {

  // cache activity data for updates
  const { data } = useQuery("activities", fetchActivities);

  const formattedRows = data && data.activities && data.activities.map((activity: ActivityInterface) => {
    const { id,  title } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    return {
      id,
      title: activityLink
    }
  });

  if(!data) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
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

  return(
    <div className="activities-container">
      <DataTable
        className="activities-table"
        defaultSortAttribute="title"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </div>
  );
}

export default Activities
