import * as React from "react";
import { withRouter } from 'react-router-dom';
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehension/activityInterface'

const ActivitySettings = (props: any) => {
  const [activity, setActivity] = React.useState<ActivityInterface>({});
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

  const generalSettingsRows = (activity) => {
    // format for DataTable to display labels on left side and values on right
    const { course, flag, passages, prompts, title } = activity
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
      },
      {
        label: 'Passage Length',
        value: passages ? passages[0].split(' ').length : null
      },
      {
        label: 'Target Reading Level',
        value: null
      },
      {
        label: 'Reading Level Score',
        value: null
      },
      {
        label: "Because",
        value: prompts ? prompts[0].text : null
      },
      {
        label: "But",
        value: prompts ? prompts[1].text : null
      },
      {
        label: "So",
        value: prompts ? prompts[2].text : null
      },
    ];
    return fields.map(field => {
      const { label, value } = field
      return {
        field: label,
        value
      }
    });
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
        rows={generalSettingsRows(activity)}
      />
    </div>
  );
}

export default ActivitySettings
