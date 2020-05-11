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
  const [showEditActivityModal, setShowEditActivityModal] = React.useState(false)
  const [showEditFlagModal, setShowEditFlagModal] = React.useState(false)
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  const fetchActivityAPI = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityId}.json`
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchActivityAPI);
      var activity = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    const { flag } = activity
    setActivity(activity);
    setFlag({ label: flag, value: flag });
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const submitActivity = (activity) => {
    // TODO: hook into Activity PUT API
    toggleEditActivityModal();
  }

  const handleUpdateFlag = () => {
    // TODO: hook into Activity PUT API for updating only the development status (as requested by curriculum)
    toggleFlagModal();
  }

  const handleFlagChange = (flag) => {
    setFlag(flag);
  }


  const toggleEditActivityModal = () => {
    setShowEditActivityModal(!showEditActivityModal);
  }

  const toggleFlagModal = () => {
    setShowEditFlagModal(!showEditFlagModal);
  }

  const flagModal = (
    <button className="quill-button fun primary outlined" id="edit-flag-button" onClick={toggleFlagModal} type="submit">
      {flag ? flag.label : ''}
    </button>
  );

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={activity} closeModal={toggleEditActivityModal} submitActivity={submitActivity} />
      </Modal>
    );
  }

  const renderFlagEditModal = () => {
    return(
      <Modal>
        <div className="edit-flag-container">
          <div className="close-button-container">
            <button className="quill-button fun primary contained" id="flag-close-button" onClick={toggleFlagModal} type="submit">x</button>
          </div>
          <DropdownInput
            className="flag-dropdown"
            handleChange={handleFlagChange}
            isSearchable={true}
            label="Development Stage"
            options={flagOptions}
            value={flag}
          />
          <div className="submit-button-container">
            <button className="quill-button fun primary contained" id="flag-submit-button" onClick={handleUpdateFlag} type="submit">
              Submit
            </button>
            <button className="quill-button fun primary contained" id="flag-cancel-button" onClick={toggleFlagModal} type="submit">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  const generalSettingsRows = (activity) => {
    // format for DataTable to display labels on left side and values on right
    const { passages, prompts, title } = activity
    const fields = [
      { 
        label: 'Title',
        value: title 
      },
      {
        label: 'Development Stage',
        value: flagModal
      },
      {
        label: 'Passage Length',
        value: passages ? `${passages[0].split(' ').length} words` : null
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

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" }, 
    { name: "", attribute:"value", width: "400px" }
  ];

  return(
    <div className="activity-settings-container">
      {showEditActivityModal && renderActivityForm()}
      {showEditFlagModal && renderFlagEditModal()}
      <DataTable
        className="activity-general-settings-table"
        headers={dataTableFields}
        rows={generalSettingsRows(activity)}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="edit-activity-button" onClick={toggleEditActivityModal} type="submit">Configure</button>
      </div>
    </div>
  );
}

export default ActivitySettings;
