import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';
import { useQueryClient, useQuery } from 'react-query';

import EditOrDeleteTurkSession from './editOrDeleteTurkSession';
import TurkSessionButton from './turkSessionButton';

import SubmissionModal from '../shared/submissionModal';
import { ActivityRouteProps, TurkSessionInterface } from '../../../interfaces/evidenceInterfaces';
import { createTurkSession, fetchTurkSessions } from '../../../utils/evidence/turkAPIs';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { DataTable, Error, Modal, Spinner, Snackbar, copyToClipboard } from '../../../../Shared/index';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';

const TurkSessions: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const [newTurkSessionDate, setNewTurkSessionDate] = React.useState<any>(null);
  const [editTurkSessionId, setEditTurkSessionId] = React.useState<string>(null);
  const [editTurkSessionDate, setEditTurkSessionDate] = React.useState<string>(null);
  const [focused, setFocusedState] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [showEditOrDeleteTurkSessionModal, setShowEditOrDeleteTurkSessionModal] = React.useState<boolean>(false);
  const [dateError, setDateError] = React.useState<string>('');
  const [submissionMessage, setSubmissionMessage] = React.useState<string>('');
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const { params } = match;
  const { activityId } = params;

  const queryClient = useQueryClient()

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // get turk session data
  const { data: turkSessionsData } = useQuery({
    queryKey: [`turk-sessions-${activityId}`, activityId],
    queryFn: fetchTurkSessions
  });

  async function handleGenerateNewTurkSession () {
    if(!newTurkSessionDate) {
      setDateError('Please choose an expiration date.')
    } else {
      createTurkSession(activityId, newTurkSessionDate).then((response) => {
        const { error } = response;
        if(error) {
          setSubmissionMessage(error);
        } else {
          setSubmissionMessage('Turk session successfully created!');
        }
        setNewTurkSessionDate(null);
        setDateError('');
        setShowSubmissionModal(true);
        // update turk sessions cache to display newly created turk session
        queryClient.refetchQueries(`turk-sessions-${activityId}`)
      });
    }
  }

  function handleEditOrDeleteTurkSession (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const target  = e.target as HTMLButtonElement;
    const { id, value } = target;
    setEditTurkSessionId(id);
    setEditTurkSessionDate(value);
    setDateError('');
    setShowEditOrDeleteTurkSessionModal(true);
    toggleSubmissionModal();
  }

  function handleEditOrDeleteMessage (message: string) {
    setSubmissionMessage(message);
  }

  function renderSubmissionModal () {
    return <SubmissionModal close={toggleSubmissionModal} message={submissionMessage} />;
  }

  function renderEditOrDeleteTurkSessionModal () {
    return(
      <Modal>
        <div className="close-button-container">
          <button className="quill-button fun primary contained" id="turk-edit-close-button" onClick={toggleEditTurkSessionModal} type="submit">x</button>
        </div>
        <EditOrDeleteTurkSession
          activityId={activityId}
          closeModal={toggleEditTurkSessionModal}
          originalSessionDate={editTurkSessionDate}
          setMessage={handleEditOrDeleteMessage}
          turkSessionId={editTurkSessionId}
        />
      </Modal>
    );
  }

  function handleCopyTurkLink (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    copyToClipboard(e, setSnackBarVisible);
  }

  const turkSessionsRows = turkSessionsData && turkSessionsData.turkSessions && turkSessionsData.turkSessions.map((turkSession: TurkSessionInterface) => {
    const { activity_id, expires_at, id } = turkSession;
    const url = `${process.env.DEFAULT_URL}/evidence/#/turk?uid=${activity_id}&id=${id}`;
    const turkLink = <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>;
    return {
      id: `${activity_id}-${id}`,
      turkLink,
      expiration: moment(expires_at).format('MMMM Do, YYYY'),
      copy: <TurkSessionButton clickHandler={handleCopyTurkLink} id={id} label="copy" value={url} />,
      edit: <TurkSessionButton clickHandler={handleEditOrDeleteTurkSession} id={id} label="edit" value={expires_at} />,
      delete: <TurkSessionButton clickHandler={handleEditOrDeleteTurkSession} id={id} label="delete" />
    }
  });

  const handleDateChange = (date: string) => { setNewTurkSessionDate(date) };

  const handleFocusChange = ({ focused }) => { setFocusedState(focused) };

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
    setSubmissionMessage('');
  }

  const toggleEditTurkSessionModal = () => {setShowEditOrDeleteTurkSessionModal(!showEditOrDeleteTurkSessionModal)  }

  if(!turkSessionsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(turkSessionsData && turkSessionsData.error) {
    return(
      <div className="error-container">
        <Error error={`${turkSessionsData.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Link", attribute:"turkLink", width: "500px" },
    { name: "Expiration Date", attribute:"expiration", width: "200px" },
    { name: "", attribute:"copy", width: "100px" },
    { name: "", attribute:"edit", width: "100px" },
    { name: "", attribute:"delete", width: "100px" },
  ];

  return(
    <div className="turk-sessions-container">
      {showSubmissionModal && renderSubmissionModal()}
      {showEditOrDeleteTurkSessionModal && renderEditOrDeleteTurkSessionModal()}
      {renderHeader(activityData, 'Collect Turk Responses')}
      <div className="add-session-container">
        <div className="date-picker-container">
          <label className="datepicker-label" htmlFor="date-picker">Expiration</label>
          <SingleDatePicker
            date={newTurkSessionDate}
            focused={focused}
            id="date-picker"
            inputIconPosition="after"
            numberOfMonths={1}
            onDateChange={handleDateChange}
            onFocusChange={handleFocusChange}
          />
        </div>
        <button
          className="generate-session-button quill-button fun primary contained"
          onClick={handleGenerateNewTurkSession}
          type="submit"
        >
          Generate Turk Session
        </button>
        {dateError && <Error error={`${dateError}`} />}
      </div>
      <DataTable
        className="turk-sessions-table"
        headers={dataTableFields}
        rows={turkSessionsRows ? turkSessionsRows : []}
      />
      <Snackbar text="Copied!" visible={snackBarVisible} />
    </div>
  );
}
export default TurkSessions
