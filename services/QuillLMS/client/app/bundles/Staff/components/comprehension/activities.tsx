import * as React from "react";
import { Link } from 'react-router-dom'
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { blankActivity } from '../../../../constants/comprehension';
import { fetchActivities } from '../../utils/comprehension/activityAPIs';
import useSWR from 'swr';

const Activities = () => {
  const [activities, setActivities] = React.useState<ActivityInterface[]>([blankActivity]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);

  const handleFetchActivities = () => {
    setLoading(true);
    fetchActivities().then((response) => {
      const { activities, error } = response;
      error && setError(error);
      activities && setActivities(activities);
      setLoading(false);
    });
  }

  // cache activity data for updates
  useSWR("activities", fetchActivities);

  React.useEffect(() => {
    handleFetchActivities();
  }, []);

  const formattedRows = activities.map((activity: ActivityInterface) => {
    const { id,  title } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    return {
      id,
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
