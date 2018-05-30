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
        <h2 className="q-h2"><i className="fa fa-warning"/>Your Quill and Google Classroom emails do not match.</h2>
        {currentGoogleWarning}
        <p>Your email account on Quill.org is <strong>{this.props.email}</strong>.</p>
        <p>Your Google Classroom email must be the same as your Quill email. If you want to use a different Google Classroom account, please <a href="https://classroom.google.com/">sign in</a> to that Google account first and then come back to Quill.</p>
        <UpdateEmail />
        <p>Make sure to press the <strong>update email button</strong> before you press next.</p>
        <a className="q-button cta-button bg-quillgreen text-white sync-button" href='/auth/google_oauth2'>
          Next: Sync With Google Classrooms
        </a>
        <p>
          <a className="return-link" href="/">Return To Your Profile</a>
        </p>
      </div>)
  }
}
