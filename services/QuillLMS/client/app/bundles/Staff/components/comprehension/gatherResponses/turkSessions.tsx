import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';
import { queryCache, useQuery } from 'react-query';

import EditOrDeleteTurkSession from './editOrDeleteTurkSession';
import TurkSessionButton from './turkSessionButton';

import SubmissionModal from '../shared/submissionModal';
import { ActivityRouteProps, TurkSessionInterface } from '../../../interfaces/comprehensionInterfaces';
import { createTurkSession, fetchTurkSessions } from '../../../utils/comprehension/turkAPIs';
import { DataTable, Error, Modal, Spinner, Snackbar, copyToClipboard } from '../../../../Shared/index';

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

  // get turk session data
  const { data } = useQuery({
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
        queryCache.refetchQueries(`turk-sessions-${activityId}`)
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

  const turkSessionsRows = data && data.turkSessions && data.turkSessions.map((turkSession: TurkSessionInterface) => {
    const { activity_id, expires_at, id } = turkSession;
    const url = `${process.env.DEFAULT_URL}/comprehension/#/turk?uid=${activity_id}&id=${id}`;
    const link = <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>;
    return {
      id: `${activity_id}-${id}`,
      link,
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

  const dataTableFields = [
    { name: "Link", attribute:"link", width: "500px" },
    { name: "Expiration Date", attribute:"expiration", width: "200px" },
    { name: "", attribute:"copy", width: "100px" },
    { name: "", attribute:"edit", width: "100px" },
    { name: "", attribute:"delete", width: "100px" },
  ];

  return(
    <div className="turk-sessions-container">
      {showSubmissionModal && renderSubmissionModal()}
      {showEditOrDeleteTurkSessionModal && renderEditOrDeleteTurkSessionModal()}
      <div className="header-container">
        <h2>Turk Sessions</h2>
      </div>
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
