import React from 'react';

import { requestPost, } from '../../../../modules/request/index'

class MergeTwoSchools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  submit = () => {
    const that = this;
    requestPost(
      `${process.env.DEFAULT_URL}/teacher_fix/merge_two_schools`,
      {
        from_school_id: that.state.fromSchoolId,
        to_school_id: that.state.toSchoolId,
        authenticity_token: getAuthToken(),
      },
      (body) => {
        this.setState({
          fromSchoolId: '',
          toSchoolId: '',
          success: 'Success!',
        });
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  updateState = e => {
    this.setState({ [`${e.target.id}SchoolId`]: e.target.value, });
  };

  renderErrorOrSuccess = () => {
    if (this.state.error) {
      return <p className="error">{this.state.error}</p>;
    } else if (this.state.success) {
      return <p>{this.state.success}</p>;
    }
  };

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
            <input id="from" onChange={this.updateState} type="text" value={this.state.fromSchoolId} />
          </div>
          <div className="input-row">
            <label>To School ID:</label>
            <input id="to" onChange={this.updateState} type="text" value={this.state.toSchoolId} />
          </div>
          <button onClick={this.submit}>Merge Teacher Accounts</button>
          {this.renderErrorOrSuccess()}
        </div>
      </div>
    );
  }
}

export default MergeTwoSchools;
