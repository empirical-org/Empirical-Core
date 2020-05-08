import * as React from "react";
import { DataTable, DropdownInput, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehension/activityInterface'
import ActivityForm from './activityForm'
import { flagOptions } from '../../../../constants/comprehension'

const ActivitySettings = (props: any) => {
  const [activity, setActivity] = React.useState<ActivityInterface>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [flag, setFlag] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false)
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  const fetchActivityAPI = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityId}.json`
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchActivityAPI);
      const activity = await response.json();
      const { flag } = activity
      setActivity(activity);
      setFlag({ label: flag, value: flag });
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const submitActivity = (activity) => {
    // TODO: hook into Activity PUT API
    setShowModal(false)
  }

  const handleFlagChange = (flag) => {
    // TODO: hook into Activity PUT API for updating only the development status (as requested by curriculum)
    setFlag(flag);
  }

  const flagDropdown = () => {
    const dropdown = (<DropdownInput
      className="flag-dropdown"
      handleChange={handleFlagChange}
      options={flagOptions}
      value={flag}
    />);
    return dropdown;
  }

  const editActivity = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={activity} closeModal={closeModal} submitActivity={submitActivity} />
      </Modal>
    );
  }

  // TODO: re-enable data inputs for course, target reading level and reading level score
  const generalSettingsRows = (activity) => {
    // format for DataTable to display labels on left side and values on right
    const { course, passages, prompts, title } = activity
    const fields = [
      { 
        label: 'Title',
        value: title 
      },
      // {
      //   label: 'Course',
      //   value: course
      // },
      {
        label: 'Development Stage',
        value: flagDropdown()
      },
      {
        label: 'Passage Length',
        value: passages ? `${passages[0].split(' ').length} words` : null
      },
      // {
      //   label: 'Target Reading Level',
      //   value: null
      // },
      // {
      //   label: 'Reading Level Score',
      //   value: null
      // },
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

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" }, 
    { name: "", attribute:"value", width: "400px" }
  ];

  return(
    <div className="activity-settings-container">
      {showModal && renderActivityForm()}
      <DataTable
        className="activity-general-settings-table"
        headers={dataTableFields}
        rows={generalSettingsRows(activity)}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" onClick={editActivity} type="submit">Configure</button>
      </div>
    </div>
  );
}

export default ActivitySettings;
