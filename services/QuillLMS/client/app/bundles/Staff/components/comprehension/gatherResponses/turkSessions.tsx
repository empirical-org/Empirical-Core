import * as React from "react";
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { RouteComponentProps } from 'react-router-dom';
import { ActivityRouteProps } from '../../../interfaces/comprehensionInterfaces';
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates'

const TurkSessions: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const [turkSessions, setTurkSessions] = React.useState<[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [focused, setFocusedState] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);
  const { params } = match;
  const { activityId } = params;
  const fetchTurkSessionsAPI = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/turk-sessions.json`

  const fetchData = async () => {
    let turkSessions: any;
    try {
      setLoading(true);
      const response = await fetch(fetchTurkSessionsAPI);
      turkSessions = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    setTurkSessions(turkSessions);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const turkSessionsRows = turkSessions.map((turkSession: any) => {
    const { activity_id, expiration, uid } = turkSession;
    const url = `https://comprehension-247816.appspot.com/turk/${activity_id}/${uid}`;
    const link = <a href={url} rel="noopener noreferrer" target="_blank">{url}</a>
    return {
      link,
      expiration
    }
  });
  
  const handleDateChange = (date) => {
    console.log('date', date);
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
    { name: "Link", attribute:"link", width: "800px" }, 
    { name: "Expiration", attribute:"expiration", width: "200px" }
  ];

  return(
    <div className="turk-sessions-container">
      <div className="add-session-container">
        <div>
          <p>Add Expiration Date</p>
          <SingleDatePicker
            date={null}
            focused={focused}
            id={`date-picker`}
            inputIconPosition="after"
            numberOfMonths={1}
            onDateChange={handleDateChange}
            onFocusChange={({ focused }) => setFocusedState(focused)}
          />
        </div>
        <button>Generate Turk Session</button>
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
