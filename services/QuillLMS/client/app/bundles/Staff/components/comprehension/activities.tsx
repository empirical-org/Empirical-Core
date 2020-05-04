import * as React from "react";
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
const fetchAllActivitiesAPI = 'https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/activities.json';

const Activities = () => {
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchAllActivitiesAPI);
      const json = await response.json();
      const { activities } = json
      setActivities(activities);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
        rows={activities}
      />
    </div>
  );
}

export default Activities
