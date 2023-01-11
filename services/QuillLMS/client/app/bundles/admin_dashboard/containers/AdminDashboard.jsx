import React from 'react';
import Pusher from 'pusher-js';

import AdminsTeachers from '../components/adminsTeachers.tsx';
import PremiumFeatures from '../components/premiumFeatures.tsx';
import CreateNewAccounts from '../components/createNewAccounts.tsx';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers.tsx';
import getAuthToken from '../../Teacher/components/modules/get_auth_token';
import { requestGet, requestPost, } from '../../../modules/request/index'
import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'

export class AdminDashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      model: {
        teachers: [],
      },
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = (skipLoading=false) => {
    const { adminId, } = this.props
    this.initializePusher(skipLoading);
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}`,
      (body) => {
        this.receiveData(body, skipLoading)
      }
    );
  };

  receiveData = (data, skipLoading) => {
    if (Object.keys(data).length > 1) {
      this.setState({ model: data, loading: false, });
    } else if (!skipLoading) {
      this.setState({ model: data, loading: true, });
    }
  };

  initializePusher = (skipLoading) => {
    const { adminId } = this.props
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    const that = this;
    channel.bind('admin-users-found', () => {
      that.getData(skipLoading)
    });
  };

  addTeacherAccount = (data) => {
    const { adminId } = this.props;
    this.setState({ error: '', });
    this.initializePusher(true)
    requestPost(
      `${process.env.DEFAULT_URL}/admins/${adminId}/create_and_link_accounts`,
      data,
      (response) => {
        this.getData(true)
        this.showSnackbar(response.message)
      },
      (response) => {
        if (response.error) {
          this.setState({ error: response.error, });
        } else {
          // to do, use Sentry to capture error
        }
      }
    );
  };

  handleUserAction = (link, data) => {
    this.initializePusher(true)
    requestPost(
      link,
      data,
      (response) => {
        this.getData(true)
        this.showSnackbar(response.message)
      },
      (response) => {
        if (response.error) {
          this.setState({ error: response.error, });
        } else {
          // to do, use Sentry to capture error
        }
      }
    );
  }

  resendLoginDetails = (data) => {
    const { adminId } = this.props;
    this.setState({ error: '', });
    requestPost(
      `${process.env.DEFAULT_URL}/admins/${adminId}/create_and_link_accounts`,
      data,
      (response) => {
        this.getData(true)
        this.showSnackbar(response.message)
      },
      (response) => {
        if (response.error) {
          this.setState({ error: response.error, });
        } else {
          // to do, use Sentry to capture error
        }
      }
    );

  }

  showSnackbar = snackbarCopy => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  };

  scrollToCreateNewAccounts = () => {
    const section = document.querySelector('#scroll-location');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    const { loading, error, snackbarCopy, model, showSnackbar, } = this.state

    if(loading) {
      return <LoadingSpinner />;
    }
    return(
      <div className="sub-container">
        <Snackbar text={snackbarCopy} visible={showSnackbar} />
        <PremiumFeatures handleClick={this.scrollToCreateNewAccounts} />
        <div className='dark-divider' id="scroll-location" />
        <CreateNewAccounts
          addTeacherAccount={this.addTeacherAccount}
          adminAssociatedSchool={model.associated_school}
          error={error}
          schools={model.schools}
        />
        <div className='dark-divider' />
        <div className="header">
          <h2>Upload Teachers via CSV</h2>
          <a className="quill-button secondary outlined fun focus-on-light csv-button" href="mailto:hello@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">Upload teachers via CSV</a>
        </div>
        <div className='dark-divider' />
        <AdminsTeachers
          adminAssociatedSchool={model.associated_school}
          data={model.teachers}
          handleUserAction={this.handleUserAction}
          refreshData={this.getData}
          schools={model.schools}
        />
      </div>
    );
  }
}

export default AdminDashboard
