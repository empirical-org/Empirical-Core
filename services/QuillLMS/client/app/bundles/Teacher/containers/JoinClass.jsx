import React from 'react'
import { Input } from 'quill-component-library/dist/componentLibrary'
import { SegmentAnalytics, Events } from '../../../modules/analytics';

import getAuthToken from '../components/modules/get_auth_token'
import LoadingIndicator from '../components/shared/loading_indicator'

const bulbSrc = `${process.env.CDN_URL}/images/onboarding/bulb.svg`

export default class JoinClass extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      classCodeInput: '',
      loading: false,
      timesSubmitted: 0,
    }

    this.addClassroom = this.addClassroom.bind(this)
    this.updateClassCode = this.updateClassCode.bind(this)
  }

  submitClass() {
    let buttonClass = "quill-button contained primary medium"
    if (!this.state.classCodeInput.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  addClassroom(e) {
    const { timesSubmitted, classCodeInput, } = this.state
    e.preventDefault();
    // this.setState({ loading: true, })
    SegmentAnalytics.track(Events.JOIN_CLASS, {mechanism: 'classCode'});
    const data = new FormData()
    data.append('classcode', classCodeInput)
    fetch(`${process.env.DEFAULT_URL}/students_classrooms`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': getAuthToken()
      },
      body: data
    })
    .then(response => response.json()) // if the response is a JSON object
    .catch((error) => {
      return { error: 'Oops! You need to be signed in to join a class.', }
    })
    .then((response) => {
      // this.setState({ loading: false, })
      if (response.error) {
        let error
        switch (response.error) {
          case 'Class is archived':
            error = 'Oops! That class has been archived. Please try a different class code.'
            break
          default:
            error = 'Enter a valid class code. Ask your teacher for help.'
            break
        }
        this.setState({ errors: { classCode: error, }, timesSubmitted: timesSubmitted + 1, })
      } else {
        window.location.href = `/classrooms/${response.id}?joined=success`
      }
    })
  }

  updateClassCode(e) {
    this.setState({ classCodeInput: e.target.value, })
  }

  render() {
    const { loading, authToken, classCodeInput, timesSubmitted, errors, } = this.state
    if (loading) {
      return <LoadingIndicator />
    }
    return (
      <div className="container account-form" id="add-class">
        <h1>Join Your Class</h1>
        <p className="sub-header">Add the class code to join your teacher's&nbsp;class.</p>
        <div className="form-container">
          <form onSubmit={this.addClassroom} acceptCharset="UTF-8" >
            <input name="utf8" type="hidden" value="✓" />
            <input value={authToken} type="hidden" name="authenticity_token" />
            <Input
              label="Add your class code"
              value={classCodeInput}
              handleChange={this.updateClassCode}
              type="text"
              className="class-code"
              error={errors.classCode}
              timesSubmitted={timesSubmitted}
            />
            <input type="submit" name="commit" value="Join your class" className={this.submitClass()} />
          </form>
        </div>

        <div className="student-info-box">
          <h3><span>Don't have a class&nbsp;code?</span> <img src={bulbSrc} alt="lightbulb" /></h3>
          <p>Ask your teacher to share the class code with&nbsp;you.</p>
          <p>To use Quill, a teacher must create a class for&nbsp;you.</p>
        </div>

      </div>
    );
  }

}
