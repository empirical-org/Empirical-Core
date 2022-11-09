import React from 'react';
import Pusher from 'pusher-js';

import AdminsTeachers from '../components/admins_teachers.tsx';
import PremiumFeatures from '../components/premium_features.tsx';
import CreateNewAccounts from '../components/create_new_accounts.tsx';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers.tsx';
import getAuthToken from '../../Teacher/components/modules/get_auth_token';
import { requestGet, requestPost, } from '../../../modules/request/index'

export default class AdminDashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      model: {
        teachers: [],
      },
      newTeacher: {
        first_name: null,
        last_name: null,
        email: null,
      },
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.initializePusher();
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${this.props.adminId}`,
      (body) => {
        this.receiveData(body)
      }
    );
  };

  receiveData = (data) => {
    if (Object.keys(data).length > 1) {
      this.setState({ model: data, loading: false, });
    } else {
      this.setState({ model: data, loading: true, });
    }
  };

  initializePusher = () => {
    const { adminId } = this.props
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    const that = this;
    channel.bind('admin-users-found', () => {
      that.getData()
    });
  };

  addTeacherAccount = (data) => {
    const { adminId } = this.props;
    this.setState({ message: '', error: '', });
    data.authenticity_token = getAuthToken();
    requestPost(
      `${process.env.DEFAULT_URL}/admins/${adminId}/teachers`,
      data,
      (response) => {
        this.setState({ message: response.message, }, () => this.getData());
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

  scrollToCreateNewAccounts = () => {
    const section = document.querySelector('.create_new_accounts');
    section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
  }

  render() {
    const { loading, error, message, model } = this.state

    if(loading) {
      return <LoadingSpinner />;
    }
    return(
      <React.Fragment>
        <div className="sub-container">
          <PremiumFeatures handleClick={this.scrollToCreateNewAccounts} />
          <div className='dark-divider' />
          <CreateNewAccounts
            addTeacherAccount={this.addTeacherAccount}
            error={error}
            message={message}
            schools={model.schools}
          />
          <div className='dark-divider' />
          <div className="header">
            <h2>Upload Teachers via CSV</h2>
            <a className="quill-button secondary outlined fun focus-on-light csv-button" href="mailto:hello@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">Upload teachers via CSV</a>
          </div>
          <div className='dark-divider' />
          <AdminsTeachers
            data={model.teachers}
            refreshData={this.getData}
          />
        </div>
        <QuestionsAndAnswers
          questionsAndAnswersFile="admin"
          supportLink="https://support.quill.org/quill-premium"
        />
      </React.Fragment>
    );
  }
}
