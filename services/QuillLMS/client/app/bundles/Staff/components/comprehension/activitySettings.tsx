import * as React from "react";
import { withRouter } from 'react-router-dom';
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';

const ActivitySettings = (props) => {
  const [activity, setActivity] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  const fetchActivityAPI = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityId}.json`
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchActivityAPI);
      const activity = await response.json();
      setActivity(activity);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const generalSettingsRows = () => {
    const { course, flag, title } = activity
    const fields = [
      { 
        label: 'Name',
        value: title 
      },
      {
        label: 'Course',
        value: course
      },
      {
        label: 'Development Status',
        value: flag
      }
    ]
    return fields.map(field => {
      return {
        field: field.label,
        value: field.value
      }
    })
  }

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
    { name: "Field", attribute:"field", width: "200px" }, 
    { name: "Value", attribute:"value", width: "400px" }
  ];

  return(
    <div className="activity-settings-container">
      <DataTable
        className="activity-general-settings-table"
        headers={dataTableFields}
        rows={generalSettingsRows()}
      />
    </div>
  );
}

export default withRouter(ActivitySettings)
