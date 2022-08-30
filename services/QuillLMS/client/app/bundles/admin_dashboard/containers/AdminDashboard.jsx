import React from 'react';
import request from 'request';
import AdminsTeachers from '../components/admins_teachers.tsx';
import PremiumFeatures from '../components/premium_features.tsx';
import CreateNewAccounts from '../components/create_new_accounts.tsx';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import QuestionsAndAnswers from '../../Teacher/containers/QuestionsAndAnswers.tsx';
import Pusher from 'pusher-js';

import getAuthToken from '../../Teacher/components/modules/get_auth_token';

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
    request.get({
      url: `${process.env.DEFAULT_URL}/admins/${this.props.adminId}`,
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      this.receiveData(parsedBody)
    });
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
    request.post(`${process.env.DEFAULT_URL}/admins/${adminId}/teachers`, {
      json: data,
    },
    (e, r, response) => {
      if (response.error) {
        this.setState({ error: response.error, });
      } else if (r.statusCode === 200) {
        this.setState({ message: response.message, }, () => this.getData());
      } else {
        // to do, use Sentry to capture error
      }
    });
  };

  render() {
    if (!this.state.loading) {
      return (
        <div >
          <div className="sub-container">
            <PremiumFeatures />
            <AdminsTeachers
              data={this.state.model.teachers}
              refreshData={this.getData}
            />
            <CreateNewAccounts
              addTeacherAccount={this.addTeacherAccount}
              error={this.state.error}
              message={this.state.message}
              schools={this.state.model.schools}
            />
            <QuestionsAndAnswers
              questionsAndAnswersFile="admin"
              supportLink="https://support.quill.org/quill-premium"
            />
          </div>
        </div>
      );
    }
    return <LoadingSpinner />;
  }
}
