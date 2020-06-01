import * as React from "react";
import { DataTable, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import { RouteComponentProps } from 'react-router-dom';
import { ActivityRouteProps } from '../../../interfaces/comprehensionInterfaces';
import EditOrDeleteTurkSession from './editOrDeleteTurkSession';
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';
import useSWR, { mutate } from 'swr';

const TurkSessions: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const [turkSessions, setTurkSessions] = React.useState<[]>([]);
  const [newTurkSessionDate, setNewTurkSessionDate] = React.useState<any>(null);
  const [editTurkSessionId, setEditTurkSessionId] = React.useState<string>(null);
  const [editTurkSessionDate, setEditTurkSessionDate] = React.useState<string>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [focused, setFocusedState] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [showEditOrDeleteTurkSessionModal, setShowEditOrDeleteTurkSessionModal] = React.useState<boolean>(false);
  const [loadingError, setLoadingError] = React.useState<string>('');
  const [dateError, setDateError] = React.useState<string>('');
  const [submissionError, setSubmissionError] = React.useState<string>('');
  const { params } = match;
  const { activityId } = params;
  const turkSessionsAPI = 'http://comprehension-247816.appspot.com/api/turking.json';

  const fetchData = async () => {
    let turkSessions: any;
    try {
      setLoading(true);
      const response = await fetch(turkSessionsAPI);
      turkSessions = await response.json();
    } catch (error) {
      setLoadingError(error);
      setLoading(false);
    }
    setTurkSessions(turkSessions);
    setLoading(false);
  };

  // cache turk sessions data for updates
  useSWR("turk-sessions", fetchData);

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateNewTurkSession = async () => {
    if(!newTurkSessionDate) {
      setDateError('Please choose an expiration date.')
    }
    const response = await fetch(turkSessionsAPI, {
      method: 'POST',
      body: JSON.stringify({
        activity_id: activityId,
        expires_at: newTurkSessionDate.toDate()
      }),
      headers: {
        "Accept": "application/JSON",
        "Content-Type": "application/json"
      },
    });
    setNewTurkSessionDate(null);
    setDateError('');
    // not a 2xx status
    if(Math.round(response.status / 100) !== 2) {
      setSubmissionError('Turk session submission failed, please try again.');
    }
    setShowSubmissionModal(true);
    // update turk sessions cache to display newly created turk session
    mutate("turk-sessions");
  }

  const handleEditOrDeleteTurkSession = (e) => {
    const { target } = e;
    const { id, value } = target;
    setEditTurkSessionId(id);
    setEditTurkSessionDate(value);
    setDateError('');
    setShowEditOrDeleteTurkSessionModal(true);
  }

  const renderSubmissionModal = () => {
    const message = submissionError ? submissionError : 'Submission successful!';
    return(
      <Modal>
        <div className="close-button-container">
          <button className="quill-button fun primary contained" id="submission-close-button" onClick={toggleSubmissionModal} type="submit">x</button>
        </div>
        <p className="submission-message">{message}</p>
      </Modal>
    );
  }

  const renderEditOrDeleteTurkSessionModal = () => {
    return(
      <Modal>
        <div className="close-button-container">
          <button className="quill-button fun primary contained" id="turk-edit-close-button" onClick={toggleEditTurkSessionModal} type="submit">x</button>
        </div>
        <EditOrDeleteTurkSession 
          activityID={activityId} 
          closeModal={toggleEditTurkSessionModal} 
          originalSessionDate={editTurkSessionDate}
          turkSessionID={editTurkSessionId} 
        />
      </Modal>
    );
  }

  const turkSessionsRows = turkSessions.map((turkSession: any) => {
    const { activity_id, expires_at, id } = turkSession;
    const url = `https://comprehension-247816.appspot.com/#/turk/${activity_id}/${id}`;
    const link = <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>;
    const editButton = (
      <button 
        className="quill-button fun primary contained" 
        id={id} 
        onClick={handleEditOrDeleteTurkSession} 
        type="submit"
        value={expires_at}
      >
        edit
      </button>
    );
    const deleteButton = (
      <button 
        className="quill-button fun primary contained" 
        id={id} 
        onClick={handleEditOrDeleteTurkSession} 
        type="submit"
      >
        delete
      </button>
    );
    return {
      link,
      expiration: moment(expires_at).format('MMMM Do, YYYY'),
      edit: editButton,
      delete: deleteButton
    }
  });
  
  const handleDateChange = (date) => { setNewTurkSessionDate(date) };
  
  const handleFocusChange = ({ focused }) => { setFocusedState(focused) };
  
  const toggleSubmissionModal = () => { setShowSubmissionModal(!showSubmissionModal) }

  const toggleEditTurkSessionModal = () => {setShowEditOrDeleteTurkSessionModal(!showEditOrDeleteTurkSessionModal)  }

  if(loading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(loadingError) {
    return(
      <div className="error-container">
        <Error error={`${loadingError}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Link", attribute:"link", width: "600px" }, 
    { name: "Expiration Date", attribute:"expiration", width: "200px" },
    { name: "", attribute:"edit", width: "100px" },
    { name: "", attribute:"delete", width: "100px" },
  ];

  return(
    <div className="turk-sessions-container">
      {showSubmissionModal && renderSubmissionModal()}
      {showEditOrDeleteTurkSessionModal && renderEditOrDeleteTurkSessionModal()}
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
        rows={turkSessionsRows}
      />
    </div>
  );
}
export default TurkSessions
