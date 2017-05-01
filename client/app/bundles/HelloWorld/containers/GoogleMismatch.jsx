import React from 'react'
import UpdateEmail from '../components/shared/update_email.jsx'
require('../../../assets/styles/app-variables.scss')


export default class extends React.Component{
  constructor(){
    super()
  }

  render(){
    const currentGoogleWarning = this.props.googleEmail ? <p>You are currently signed into Google as <span>{this.props.googleEmail}</span>.</p> : null
    return(
      <div className='google-mismatch-container'>
        <h2 className="q-h2"><i className="fa fa-exclamation-triangle"/>Your Quill and Google Classroom emails do not match.</h2>
        {currentGoogleWarning}
        <p>Your email account on Quill.org is <span>{this.props.email}</span>.</p>
        <p>Your Google Classroom email must be the same as your Quill email. If you want to use a different Google Classroom account, please <a href="https://classroom.google.com/">sign in</a> to that Google account first and then come back to Quill.</p>
        <UpdateEmail />
        <p>Make sure to press the <span>update email button</span> before you press next.</p>
        <a className="q-button cta-button bg-quillgreen text-white sync-button" href='/auth/google_oauth2'>
          Next: Sync With Google Classrooms
        </a>
        <a className="return-link" href="/">Return To Your Profile</a>
      </div>)
  }
}
