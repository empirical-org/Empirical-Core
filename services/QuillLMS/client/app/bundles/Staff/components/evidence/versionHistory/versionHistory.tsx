import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import moment from 'moment';

import { sort } from '../../../../../modules/sortingMethods.js';
import SubmissionModal from '../shared/submissionModal';
import { fetchActivity, fetchActivityVersions, updateActivityVersion } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, ReactTable, Spinner, TextArea } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const formatChangeLogRows = (activityVersionData) => {
  if (!activityVersionData?.changeLogs) return []
  return activityVersionData.changeLogs.map(row => {
    const {
      note,
      start_date,
      session_count,
      new_value
    } = row

    return {
      startDate: `${moment(start_date).utcOffset('-0500').format('YYYY/MM/DD h:mm a')} ET`,
      version: new_value,
      sessionCount: session_count,
      notes: note,
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
    if (version === 1) return 'Initial Version'
    return version
  }

  const formattedRows = formatChangeLogRows(activityVersionData)

  const dataTableFields = [
    {
      Header: 'Time',
      accessor: "startDate",
      key: "startDate",
      sortMethod: sort,
      width: 200,
    },
    {
      Header: 'Version',
      accessor: "version",
      key: 'version',
      sortMethod: sort,
      width: 120
    },
    {
      Header: 'Sessions',
      accessor: "sessionCount",
      key: 'sessionCount',
      sortMethod: sort,
      width: 120
    },
    {
      Header: 'Notes',
      accessor: "notes",
      key: "notes",
      sortMethod: sort,
      width: 600,
    }
  ];

  const { activity } = activityData

  return(
    <div className="version-history-container">
      {showSubmissionModal && renderSubmissionModal()}
      {activity && renderHeader({activity: activity}, 'Version History', true)}
      <section className="version-info-section">
        <p className="version-history-label">Activity ID:</p>
        <p>{activity?.id}</p>
      </section>
      <section className="version-info-section">
        <p className="version-history-label">Activity title:</p>
        <p>{activity?.title}</p>
      </section>
      <section className="version-info-section">
        <p className="version-history-label">Current version:</p>
        <p>{activityVersionDisplayValue(activity)}</p>
      </section>
      <TextArea
        characterLimit={1000}
        className="notes-input"
        error={errors[TITLE]}
        handleChange={handleSetActivityVersionNote}
        label='Notes for new version:'
        timesSubmitted={0}
        value={activityVersionNote}
      />
      <div className="button-and-id-container">
        <button className="quill-button fun primary contained focus-on-light" id="activity-submit-button" onClick={handleUpdateActivity} type="submit">Increment version to {activity?.version + 1}</button>
      </div>
      {!!errors.length && errors.map(error => (
        <p>{error}</p>
      ))}
      {formattedRows && (<ReactTable
        className="activity-versions-table"
        columns={dataTableFields}
        data={formattedRows}
        defaultPageSize={100}
        defaultSorted={[{id: 'version', desc: true}]}
      />)}
    </div>
  );
}

export default VersionHistory;
