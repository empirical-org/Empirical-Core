import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { queryCache, useQuery } from 'react-query'

import ActivityForm from './activityForm';

import { ActivityInterface, ActivityRouteProps } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import SubmissionModal from '../shared/submissionModal';
// import { flagOptions } from '../../../../../constants/comprehension';
import { fetchActivity, updateActivity, archiveParentActivity } from '../../../utils/comprehension/activityAPIs';
import { promptsByConjunction } from "../../../helpers/comprehension";
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const ActivitySettings: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {

  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  // const [activityFlag, setActivityFlag] = React.useState<FlagInterface>(null);
  const [showEditActivityModal, setShowEditActivityModal] = React.useState<boolean>(false);
  // const [showEditFlagModal, setShowEditFlagModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const { params } = match;
  const { activityId } = params;

  // cache activity data for updates
  const { data } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const handleClickArchiveActivity = () => {
    if (window.confirm('Are you sure you want to archive? If you archive, it will not be displayed on the "View Activities" page')) {
      archiveParentActivity(data.activity.parent_activity_id).then((response) => {
        const { error } = response;
        error && setErrorOrSuccessMessage(error);
        queryCache.refetchQueries(`activity-${activityId}`)
        if(!error) {
          setShowEditActivityModal(false);
          // reset errorOrSuccessMessage in case of subsequent submission
          setErrorOrSuccessMessage('Activity successfully archived!');
        }
        toggleSubmissionModal();
      });

    }
  }

  const handleUpdateActivity = (activity: ActivityInterface) => {
    updateActivity(activity, activityId).then((response) => {
      const { error } = response;
      error && setErrorOrSuccessMessage(error);
      queryCache.refetchQueries(`activity-${activityId}`)
      if(!error) {
        setShowEditActivityModal(false);
        // reset errorOrSuccessMessage in case of subsequent submission
        setErrorOrSuccessMessage('Activity successfully updated!');
      }
      toggleSubmissionModal();
    });
  }

  // const handleUpdateFlag = () => {
  //   let updatedActivity: any = data.activity;
  //   updatedActivity.flag = activityFlag.value;
  //   handleUpdateActivity(updatedActivity);
  //   setShowEditFlagModal(false);
  // }

  // const handleFlagChange = (flag: { label: string, value: {}}) => {
  //   setActivityFlag(flag);
  // }


  const toggleEditActivityModal = () => {
    setShowEditActivityModal(!showEditActivityModal);
  }

  // const toggleFlagModal = () => {
  //   // only update flag if submit button is clicked
  //   if(activityFlag !== data.flag) {
  //     setActivityFlag(data.flag);
  //   }
  //   setShowEditFlagModal(!showEditFlagModal);
  // }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  // const flagModal = (
  //   <button className="quill-button fun primary outlined" id="edit-flag-button" onClick={toggleFlagModal} type="submit">
  //     {data && data.flag ? data.flag.label : ''}
  //   </button>
  // );

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={data && data.activity} closeModal={toggleEditActivityModal} submitActivity={handleUpdateActivity} />
      </Modal>
    );
  }

  // const renderFlagEditModal = () => {
  //   return(
  //     <Modal>
  //       <div className="edit-flag-container">
  //         <div className="close-button-container">
  //           <button className="quill-button fun primary contained" id="flag-close-button" onClick={toggleFlagModal} type="submit">x</button>
  //         </div>
  //         <DropdownInput
  //           className="flag-dropdown"
  //           handleChange={handleFlagChange}
  //           isSearchable={true}
  //           label="Development Stage"
  //           options={flagOptions}
  //           value={activityFlag ? activityFlag : data.flag}
  //         />
  //         <div className="submit-button-container">
  //           <button className="quill-button fun primary contained" id="flag-submit-button" onClick={handleUpdateFlag} type="submit">
  //             Submit
  //           </button>
  //           <button className="quill-button fun primary contained" id="flag-cancel-button" onClick={toggleFlagModal} type="submit">
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     </Modal>
  //   )
  // }

  const renderSubmissionModal = () => {
    const message = errorOrSuccessMessage ? errorOrSuccessMessage : 'Activity successfully updated!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  const generalSettingsRows = ({ activity }) => {
    if(!activity) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { passages, prompts, title, scored_level, target_level } = activity

      const passageLength = passages && passages[0] ? `${passages[0].text.split(' ').length} words` : null;
      const formattedPrompts = promptsByConjunction(prompts);
      const becauseText = formattedPrompts && formattedPrompts[BECAUSE] ? formattedPrompts[BECAUSE].text : null;
      const butText = formattedPrompts && formattedPrompts[BUT] ? formattedPrompts[BUT].text : null;
      const soText = formattedPrompts && formattedPrompts[SO] ? formattedPrompts[SO].text : null;

      const fields = [
        {
          label: 'Title',
          value: title
        },
        // {
        //   label: 'Development Stage',
        //   value: flagModal
        // },
        {
          label: 'Scored Reading Level',
          value: scored_level || 'not set'
        },
        {
          label: 'Target Reading Level',
          value: target_level || 'not set'
        },
        {
          label: 'Passage Length',
          value: passageLength
        },
        {
          label: "Because",
          value: becauseText
        },
        {
          label: "But",
          value: butText
        },
        {
          label: "So",
          value: soText
        },
      ];
      return fields.map((field, i) => {
        const { label, value } = field
        return {
          id: `${field}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  if(!data) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(data && data.error) {
    return(
      <div className="error-container">
        <Error error={`${data.error}`} />
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
      {/* {showEditFlagModal && renderFlagEditModal()} */}
      {showSubmissionModal && renderSubmissionModal()}
      <DataTable
        className="activity-general-settings-table"
        headers={dataTableFields}
        rows={generalSettingsRows(data)}
      />
      <div className="button-container">
        <div>
          <a className="quill-button fun secondary outlined" href={`/comprehension/#/play?uid=${activityId}`} rel="noopener noreferrer" target="_blank">Play Activity</a>
          {data.activity.parent_activity_id && <button className="quill-button fun secondary outlined" onClick={handleClickArchiveActivity} type="button">Archive Activity</button>}
        </div>
        <button className="quill-button fun primary contained" id="edit-activity-button" onClick={toggleEditActivityModal} type="submit">Configure</button>
      </div>
    </div>
  );
}

export default ActivitySettings;
