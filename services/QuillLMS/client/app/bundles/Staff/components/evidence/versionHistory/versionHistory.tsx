import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';

import { sort } from '../../../../../modules/sortingMethods.js';
import SubmissionModal from '../shared/submissionModal';
import { fetchActivity, fetchActivityVersions, updateActivityVersion } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, ReactTable, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const formatChangeLogRows = (activityVersionData) => {
  if (!activityVersionData?.changeLogs) return []
  return activityVersionData.changeLogs.map(row => {
    const {
      note,
      updated_at,
      new_value
    } = row

    return {
      updatedAt: updated_at,
      note,
      version: new_value
    }
  })
}

const VersionHistory = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const queryClient = useQueryClient()

  const [activityVersionNote, setActivityVersionNote] = React.useState<string>('');

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: activityVersionData, status: status } = useQuery({
    queryKey: [`change-logs-for-activity-versions-${activityId}`, activityId],
    queryFn: fetchActivityVersions
  });

  function handleUpdateActivity () {
    if (!confirm('⚠️ Are you sure you want to increment the activity version?')) return

    updateActivityVersion(activityVersionNote, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        queryClient.refetchQueries(`activity-${activityId}`)
        queryClient.refetchQueries(`change-logs-for-activity-versions-${activityId}`)
        setErrors([]);
        setErrorOrSuccessMessage('Activity Version successfully updated!');
        toggleSubmissionModal();
      }
    });
  }

  function toggleSubmissionModal() {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function renderSubmissionModal() {
    const message = errorOrSuccessMessage || 'Activity successfully updated!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  function handleSetActivityVersionNote(e: InputEvent){ setActivityVersionNote(e.target.value) };

  if(!activityId || !activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const activityVersionDisplayValue = ({version}): string => {
    if (version === 0) return 'Initial Version'
    return version
  }

  const formattedRows = formatChangeLogRows(activityVersionData)

  const dataTableFields = [
    {
      Header: 'Date/Time',
      accessor: "updatedAt",
      key: "updatedAt",
      sortMethod: sort,
      width: 160,
    },
    {
      Header: 'Version',
      accessor: "version",
      key: 'version',
      sortMethod: sort,
      width: 160
    },
    {
      Header: 'Note',
      accessor: "note",
      key: "note",
      sortMethod: sort,
      width: 251,
    }
  ];

  const { activity } = activityData

  return(
    <div className="version-history-container">
      {showSubmissionModal && renderSubmissionModal()}
      {activity && renderHeader({activity: activity}, 'Version History', true)}
      <p><b>Activity id:</b> {activity?.id}   <b>Activity title:</b> {activity?.title}</p>
      <p><b>Current version:</b> {activityVersionDisplayValue(activity)}</p>
      <p><b>Notes for new version:</b></p>
      <Input
        className="notes-input"
        error={errors[TITLE]}
        handleChange={handleSetActivityVersionNote}
        label="version notes"
        value={activityVersionNote}
      />

      <div className="button-and-id-container">
        <button className="quill-button fun primary contained focus-on-light" id="activity-submit-button" onClick={handleUpdateActivity} type="submit">Increment version to {activity?.version + 1}</button>
      </div>
      <br />

      {formattedRows && (<ReactTable
        className="activity-versions-table"
        columns={dataTableFields}
        data={formattedRows}
        defaultPageSize={100}
        defaultSorted={[{id: 'updatedAt', desc: true}]}
      />)}

    </div>
  );
}

export default VersionHistory;
