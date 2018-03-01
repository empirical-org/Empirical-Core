import React from 'react';
import request from 'request';
import getAuthToken from '../modules/get_auth_token';

class MergeTwoSchools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.updateState = this.updateState.bind(this);
    this.submit = this.submit.bind(this);
    this.renderErrorOrSuccess = this.renderErrorOrSuccess.bind(this);
  }

  updateState(e) {
    this.setState({ [`${e.target.id}SchoolId`]: e.target.value, });
  }

  submit() {
    const that = this;
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/merge_two_schools`,
      json: {
        from_school_id: that.state.fromSchoolId,
        to_school_id: that.state.toSchoolId,
        authenticity_token: getAuthToken(),
      },
    }, (e, r, response) => {
      if (response.error) {
        this.setState({
          error: response.error,
        });
      } else {
        this.setState({
          fromSchoolId: '',
          toSchoolId: '',
          success: 'Success!',
        });
      }
    });
  }

  renderErrorOrSuccess() {
    if (this.state.error) {
      return <p className="error">{this.state.error}</p>;
    } else if (this.state.success) {
      return <p>{this.state.success}</p>;
    }
  }

  render() {
    return (
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <h2>Merge Two Schools</h2>
        <p>This allows you to transfer all of the teachers in one school over to a second school.</p>
        <p>This is useful for when teachers signed in with Clever and caused a new school to be created that is a duplicate of a school we already have in the database.</p>
        <div>
          <div className="input-row">
            <label>From School ID:</label>
            <input type="text" value={this.state.fromSchoolId} onChange={this.updateState} id="from" />
          </div>
          <div className="input-row">
            <label>To School ID:</label>
            <input type="text" value={this.state.toSchoolId} onChange={this.updateState} id="to" />
          </div>
          <button onClick={this.submit}>Merge Teacher Accounts</button>
          {this.renderErrorOrSuccess()}
        </div>
      </div>
    );
  }
}

export default MergeTwoSchools;
