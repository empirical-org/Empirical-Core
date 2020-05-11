import * as React from "react";
import { Link } from 'react-router-dom'
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { ActivitiesInterface } from '../../interfaces/comprehension/activitiesInterface'
const fetchAllActivitiesAPI = 'https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/activities.json';

const Activities = () => {
  const [activities, setActivities] = React.useState<ActivitiesInterface>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchAllActivitiesAPI);
      var json = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    const { activities } = json
    setActivities(activities);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const formattedRows = activities.map(activity => {
    const { course, id, title } = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    return {
      title: activityLink,
      course 
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
    { name: "Title", attribute:"title", width: "700px" }, 
    { name: "Course", attribute:"course", width: "300px" }
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
