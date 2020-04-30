import * as React from "react";
import { DataTable, Spinner } from 'quill-component-library/dist/componentLibrary';

const Activities = () => {
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null)
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/activities.json');
        const json = await response.json();
        setActivities(json.activities)
        setLoading(false)
      } catch (error) {
        setError(error);
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  const renderActivites = () => {
    const fields = [{ name: "Title", attribute:"title", width: "800px" }, { name: "Course", attribute:"course", width: "400px" }]
    return(
      <DataTable
        className="activities-table"
        headers={fields}
        rows={activities}
      />
    )
  }
  return(
    <div className="activities-container">
      {loading && <div className="spinner-container"><Spinner /></div>}
      {error && <div className="error-container">{`${error}`}</div>}
      {activities && activities.length !== 0 && renderActivites()}
    </div>
  )
}

export default Activities
