import * as React from "react";
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';
import useSWR, { mutate } from 'swr'

const EditTurkSession = ({ activityID, closeModal, originalSessionDate, turkSessionID }) => {
  const [turkSessionDate, setTurkSessionDate] = React.useState<any>(moment(originalSessionDate));
  const [focused, setFocusedState] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const editOrDeleteTurkSessionsAPI = `https://comprehension-247816.appspot.com/api/turking/${turkSessionID}.json`;

  const handleDateChange = (date) => { setTurkSessionDate(date) };
  
  const handleFocusChange = ({ focused }) => { setFocusedState(focused) };

  const handleEditTurkSession = async () => {
    try {
      await fetch(editOrDeleteTurkSessionsAPI, {
        method: 'PUT',
        body: JSON.stringify({
          activity_id: activityID, 
          expires_at: turkSessionDate 
        }),
        headers: {
          "Accept": "application/JSON",
          "Content-Type": "application/json"
        },
      });
    } catch (error) {
      setError(error);
    }
    // update turk sessions cache to display newly created turk session
    mutate("turk-sessions");

    setError('');
    closeModal();
  }

  const handleDeleteTurkSession = async () => {
    try {
      await fetch(editOrDeleteTurkSessionsAPI, {
        method: 'DELETE'
      });
    } catch (error) {
      setError(error);
    }
    // update turk sessions cache to reflect deleted turk session
    mutate("turk-sessions");

    setError('');
    closeModal();
  }

  const renderEditContent = () => {
    return(
      <React.Fragment>
        <div className="date-picker-container">
          <label className="datepicker-label" htmlFor="date-picker">Expiration</label>
          <SingleDatePicker
            date={turkSessionDate}
            focused={focused}
            id="date-picker"
            inputIconPosition="after"
            numberOfMonths={1}
            onDateChange={handleDateChange}
            onFocusChange={handleFocusChange}
          />
        </div>
        <div className="submit-button-container">
          {error && <p className="edit-error-message">{error}</p>}
          <button className="quill-button fun primary contained" id="edit-turk-submit-button" onClick={handleEditTurkSession} type="submit">
            Submit
          </button>
        </div>
      </React.Fragment>
    );
  }

  const renderDeleteContent = () => {
    return(
      <React.Fragment>
        <p className="delete-message">Are you sure you want to delete this session?</p>
        <div className="submit-button-container">
          {error && <p className="edit-error-message">{error}</p>}
          <button className="quill-button fun primary contained" id="delete-turk-submit-button" onClick={handleDeleteTurkSession} type="submit">
            Delete
          </button>
        </div>
      </React.Fragment>
    );
  }

  return(
    <div className="edit-turk-session-container">
      {originalSessionDate && renderEditContent()}
      {!originalSessionDate && renderDeleteContent()}
    </div>
  );
}
export default EditTurkSession
