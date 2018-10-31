import React from 'react';
import request from 'request';
import _ from 'underscore';

export default class NumberOfActiveStudents extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      errors: false,
    };
    this.initializePusher = this.initializePusher.bind(this);
    this.clearStudentData = this.clearStudentData.bind(this);
  }

  componentDidMount() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/real_time_data`,
    }, (e, r, body) => {
      const data = JSON.parse(body).data;
      const studentsData = data;
      that.setState({ loading: false, errors: body.errors, studentsData, });
    });
    this.initializePusher();
  }

  clearStudentData() {
    const studentsData = { data: {}, };
    this.setState({ studentsData, });
  }

  initializePusher() {
    const { currentUser, } = this.props;
    const teacherId = currentUser.id;
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(teacherId.toString());
    const maxIntervalWithoutInteractionBeforeClearing = 60000;
    let clearStudentDataAfterPause = setTimeout(
      this.clearStudentData,
      maxIntervalWithoutInteractionBeforeClearing
    );
    channel.bind('as-interaction-log-pushed', (pushedData) => {
      // reset clock on table
      clearTimeout(clearStudentDataAfterPause);
      clearStudentDataAfterPause = setTimeout(
        this.clearStudentData,
        maxIntervalWithoutInteractionBeforeClearing
      );
      const studentsData = pushedData.data;
      this.setState({ studentsData, });
    });
  }
  //<input onClick={this.search} type="submit" value="Submit" />

  render() {
    console.log('ok');
    const numStudentsOnline = (typeof this.state.studentsData === 'undefined') ? 0 : this.state.studentsData.length;
    console.log(numStudentsOnline);
    console.log('ok end');
    return (

      <div id="active-students" className="navbar-tooltip-trigger" tabIndex="1">
        <span className="Oval-2-Copy-8"></span><span>10 Students</span>
      </div>
    );
  }
}
