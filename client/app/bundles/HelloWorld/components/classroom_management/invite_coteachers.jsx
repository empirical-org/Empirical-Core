import React from 'react';
import CoteacherCapabilityChart from './coteacher_capability_chart.jsx';
import getAuthToken from '../modules/get_auth_token';
import request from 'request';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Select from 'react-select';
require('react-select/dist/react-select.css')

export default class extends React.Component {
  constructor(props) {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.state = {
      email: '',
      coteacher_invited: false
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value})
  }

  handleClick() {
    const that = this;
    const selectedClassrooms = this.state.selectedClassrooms;
    if(!selectedClassrooms || !selectedClassrooms.length) {
      return alert('Please select at least one classroom first.');
    }
    const classroom_ids = selectedClassrooms.map(classroom => classroom.value);
    request.post({
      url: `${process.env.DEFAULT_URL}/invitations/create_coteacher_invitation`,
      json: {
        authenticity_token: getAuthToken(),
        invitee_email: that.state.email,
        classroom_ids: classroom_ids
      }
    }, (error, httpStatus, body) => {
      if (body.error) {
        alert(body.error);
      } else {
        this.props.onSuccess();
        this.setState({email: ''});
      }
    });
  }

  handleDropdownChange(value) {
    this.setState({ selectedClassrooms: value })
  }

  render() {
    return (
      <div className='invite-coteachers'>
        <h1>Invite Coteachers</h1>
        <div className='instructions'>
          <p>
            <span className='bold'>Teachers New to Quill?</span>
            Input their email address, and they will receive an invite to join your Quill class.</p>
          <p>
            <span className='bold'>Teachers have Quill accounts?</span>
            When you submit their email address, they will join your class.</p>
        </div>
        <div className="flex-row space-between vertically-centered add-coteacher-row">
          <div>
            <div>Email</div>
            <input type="email" value={this.state.email} placeholder={'Email Address'} onChange={this.handleEmailChange}/>
          </div>
          <div>
            <div>Select Classes</div>
              <Select
                name="form-field-name"
                value={this.state.value}
                multi={true}
                onChange={this.handleDropdownChange}
                options={this.props.classrooms}
                value={this.state.selectedClassrooms}
              />
          </div>
          <button className='button-green' onClick={this.handleClick}>Add Coteacher</button>
          <div>
            {this.state.coteacher_invited
                        ? 'Coteacher Invited!'
                        : ''}
          </div>
        </div>
        <CoteacherCapabilityChart/>
      </div>
    );
  }
}
