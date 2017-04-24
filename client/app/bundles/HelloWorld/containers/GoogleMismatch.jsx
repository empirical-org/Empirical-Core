import React from 'react'
import UpdateEmail from '../components/shared/update_email.jsx'
require('../../../assets/styles/app-variables.scss')


export default class extends React.Component{
  constructor(){
    super()
  }

  render(){
    const currentGoogleWarning = this.props.googleEmail ? <p>You are logged into Google as {this.props.googleEmail}.</p> : null
    return(
      <div className='google-mismatch-container'>
        <h2 className="q-h2"><i className="fa fa-exclamation-triangle"/>Your Quill email doesn't match your Google Classroom email.</h2>
        <p>Your email account on Quill.org is {this.props.email}.</p>
        {currentGoogleWarning}
        <p>Please update your Quill email to match your Google Classroom email.</p>
        <UpdateEmail />
        <p>Make sure to press the update email button before you press next.</p>
        <a className="q-button cta-button bg-quillgreen text-white" href='/auth/google_oauth2'>
          Next: Sync With Google Classrooms
        </a>
        <a href="/">Return To Your Profile</a>
      </div>)
  }
}
