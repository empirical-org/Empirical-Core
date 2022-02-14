import * as React from 'react';

const SignupModal = (props) =>
  (<div>
    <div className="signup-modal-background" onClick={props.closeModal} />
    <div className="signup-modal">
      <img alt="" className="exit" onClick={props.closeModal} src="https://assets.quill.org/images/icons/CloseIcon.svg" />
      <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/signup-to-customize.png" />
      <h1>Sign Up to Customize This Lesson</h1>
      <p>In order to customize this lesson, you need to sign up to Quill! Once you have signed up, you can input your own prompts and activities to tailor the lesson to the needs and interests of your students.</p>
      <button onClick={props.goToSignup}>Sign Up For Quill</button>
      <a href={`${process.env.DEFAULT_URL}/session/new`}>Already Have an Account? Login</a>
    </div>
  </div>);

export default SignupModal
