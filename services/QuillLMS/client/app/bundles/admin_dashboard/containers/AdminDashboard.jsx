import React from 'react';
import Pusher from 'pusher-js';

import { RESTRICTED, LIMITED, FULL, } from '../shared'
import AdminsTeachers from '../components/adminsTeachers.tsx';
import PremiumFeatures from '../components/premiumFeatures.tsx';
import CreateNewAccounts from '../components/createNewAccounts.tsx';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers.tsx';
import getAuthToken from '../../Teacher/components/modules/get_auth_token';
import { requestGet, requestPost, } from '../../../modules/request/index'
import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'

const DEFAULT_MODEL = { teachers: [] }

const AdminDashboard = ({ adminId, accessType, passedModel, }) => {
  const [loading, setLoading] = React.useState(passedModel ? false : true)
  const [model, setModel] = React.useState(passedModel || DEFAULT_MODEL)
  const [error, setError] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  React.useEffect(getData, [])

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function getData(skipLoading=false) {
    initializePusher(skipLoading);
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}`,
      (body) => {
        receiveData(body, skipLoading)
      }
    );
  }

  function receiveData(data, skipLoading) {
    if (Object.keys(data).length > 1) {
      setModel(data)
      setLoading(false)
    } else if (!skipLoading) {
      setModel(data)
      setLoading(true)
    }
  };

  function initializePusher(skipLoading) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('admin-users-found', () => {
      getData(skipLoading)
    });
  };

  function addTeacherAccount(data) {
    setError('')
    initializePusher(true)
    requestPost(
      `${process.env.DEFAULT_URL}/admins/${adminId}/create_and_link_accounts`,
      data,
      (response) => {
        getData(true)
        setSnackbarText(response.message)
        setShowSnackbar(true)
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          // to do, use Sentry to capture error
        }
      }
    );
  };

  function handleUserAction(link, data) {
    setError('')
    initializePusher(true)
    requestPost(
      link,
      data,
      (response) => {
        getData(true)
        setSnackbarText(response.message)
        setShowSnackbar(true)
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          // to do, use Sentry to capture error
        }
      }
    );
  }

  function resendLoginDetails(data) {
    setError('')
    requestPost(
      `${process.env.DEFAULT_URL}/admins/${adminId}/create_and_link_accounts`,
      data,
      (response) => {
        getData(true)
        setSnackbarText(response.message)
        setShowSnackbar(true)
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          // to do, use Sentry to capture error
        }
      }
    );

  }

  function scrollToCreateNewAccounts() {
    const section = document.querySelector('#scroll-location');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showRestrictedElementSnackbar() {
    setSnackbarText("Sorry, only verified admins with a subscription to School or District Premium can access this feature.")
    setShowSnackbar(true)
  }

  function onClickTeacherAccess() {
    if (accessType === RESTRICTED) {
      showRestrictedElementSnackbar()
    } else {
      scrollToCreateNewAccounts()
    }
  }

  let trainingOptionsElement = <button className="quill-button fun secondary outlined training-options-button" onClick={showRestrictedElementSnackbar} type="button">View available training options</button>
  let uploadTeachersViaCSVElement = <button className="quill-button secondary outlined fun focus-on-light csv-button" onClick={showRestrictedElementSnackbar} type="button">Upload teachers via CSV</button>

  if (accessType === FULL) {
    trainingOptionsElement = <a className="quill-button fun secondary outlined training-options-button" href="https://docsend.com/view/9r6gzp5v8w5ky6w9" rel="noopener noreferrer" target="_blank">View available training options</a>
    uploadTeachersViaCSVElement = <a className="quill-button secondary outlined fun focus-on-light csv-button" href="mailto:hello@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">Upload teachers via CSV</a>
  }

  if(loading) {
    return <LoadingSpinner />;
  }

  return(
    <div className="sub-container">
      <Snackbar text={snackbarText} visible={showSnackbar} />
      <PremiumFeatures handleClick={onClickTeacherAccess} trainingOptionsElement={trainingOptionsElement} />
      <div className='dark-divider' />
      <CreateNewAccounts
        accessType={accessType}
        addTeacherAccount={addTeacherAccount}
        adminAssociatedSchool={model.associated_school}
        error={error}
        schools={model.schools}
      />
      <div className='dark-divider' />
      <div className="header">
        <h2>Upload Teachers via CSV</h2>
        {uploadTeachersViaCSVElement}
      </div>
      <div className='dark-divider' id="scroll-location" />
      <AdminsTeachers
        accessType={accessType}
        adminAssociatedSchool={model.associated_school}
        data={model.teachers}
        handleUserAction={handleUserAction}
        refreshData={getData}
        schools={model.schools}
      />
    </div>
  );
}

export default AdminDashboard
