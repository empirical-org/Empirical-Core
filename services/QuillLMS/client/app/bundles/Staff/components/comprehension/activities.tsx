import * as React from "react";
import { Link } from 'react-router-dom'
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { blankActivity } from '../../../../constants/comprehension';
import { activitiesGetAPI } from '../../utils/comprehensionAPIs';
import useSWR from 'swr';

const Activities = () => {
  const [activities, setActivities] = React.useState<ActivityInterface[]>([blankActivity]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);
  
  const fetchData = async () => {
    let activities: ActivityInterface[];
    try {
      setLoading(true);
      const response = await fetch(activitiesGetAPI);
      activities = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    setActivities(activities);
    setLoading(false);
  };

  // cache activity data for updates
  useSWR("activities", fetchData);

  React.useEffect(() => {
    fetchData();
  }, []);

  const formattedRows = activities.map((activity: ActivityInterface) => {
    const { id,  title } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    return {
      title: activityLink
    }
  });

  if(loading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(error) {
    return(
      <div className="error-container">
        <Error error={`${error}`} />
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
        rows={formattedRows}
      />
    </div>
  );
}

export default Activities
