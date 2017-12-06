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
        <h1>Invite Co-Teachers</h1>
        <div className='instructions'>
          <p>
            <span className='bold'>Teachers New to Quill?</span>
            Input their email address, and they will receive an invite to join your Quill class.</p>
          <p>
            <span className='bold'>Teachers have Quill accounts?</span>
            When you submit their email address, they will join your class.</p>
        </div>
        <div style={{display: 'flex'}}>
          <div style={{flexBasis: '50%', marginRight: 20}}>
            <div>
              <div>Email</div>
              <input type="email" value={this.state.email} placeholder={'Email Address'} onChange={this.handleEmailChange} style={{width: '100%'}}/>
            </div>
            <br />
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
            <br />
            <div style={{marginBottom: 10}}>
              <button className='button-green' onClick={this.handleClick}>Add Co-Teacher</button>
            </div>
            <div>
              {this.state.coteacher_invited
                          ? 'Co-Teacher Invited!'
                          : ''}
            </div>
          </div>
          <div style={{flexBasis: '50%', marginLeft: 20}}>
            <CoteacherCapabilityChart/>
          </div>
        </div>
      </div>
    );
  }
}
