import React from 'react';
import CoteacherCapabilityChart from './coteacher_capability_chart.jsx'
import request from 'request';

export default class extends React.Component {
  constructor(props) {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      email: '',
      coteacher_invited: false
    };
  }

  handleEmailChange(e){
    this.setState({email: e.target.value})
  }

  handleClick(){
    const that = this;
    request.post(
      {
        url: `${process.env.DEFAULT_URL}/coteacher_invitations/new`,
        json: {invitee_email: that.state.email}
      },
      (error, httpStatus, body) => {
        console.log('httpStatus', httpStatus);
    });
  }

  // validateEmail
  // [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?

  render() {
    return (
      <div className='invite-coteachers'>
        <h1>Invite Coteachers</h1>
        <div className='instructions'>
          <p><span className='bold'>Teachers New to Quill?</span> Input their email address, and they will receive an invite to join your Quill class.</p>
          <p><span className='bold'>Teachers have Quill accounts?</span> When you submit their email address, they will join your class.</p>
        </div>
        <table>
          <tbody>
          <thead>
            <th>Email Address</th>
            <th>Select Classes</th>
              <tr>
                <td>
                  <input type="email" value={this.state.email} placeholder={'Email Address'} onChange={this.handleEmailChange} />
                </td>
                <td>Classlist dropdown checkbox hybrid</td>
                <td><button className='button-green' onClick={this.handleClick}>Add Coteacher</button></td>
                <td className=''>{this.state.coteacher_invited ? 'Coteacher Invited!' : ''}</td>
              </tr>
          </thead>
        </tbody>
        </table>
        <CoteacherCapabilityChart/>
      </div>
  	);
  }
}
