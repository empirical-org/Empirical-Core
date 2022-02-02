import React from 'react'

import getAuthToken from '../components/modules/get_auth_token'
import LoadingIndicator from '../components/shared/loading_indicator'
import { Input, } from '../../Shared/index'

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
  }

  componentDidMount() {
    document.title = 'Quill.org | Join a Class'
  }

  handleFormSubmission = (e) => {
    const { timesSubmitted, classCodeInput, } = this.state
    e.preventDefault();
    // this.setState({ loading: true, })
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

  submitClass() {
    const { classCodeInput, } = this.state
    let buttonClass = "quill-button contained primary medium focus-on-light"
    if (!classCodeInput.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  updateClassCode = (e) => {
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
        <p className="sub-header">Add the class code to join your teacher&#39;s&nbsp;class.</p>
        <div className="form-container">
          <form acceptCharset="UTF-8" onSubmit={this.handleFormSubmission} >
            <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
            <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
            <Input
              className="class-code"
              error={errors.classCode}
              handleChange={this.updateClassCode}
              label="Add your class code"
              timesSubmitted={timesSubmitted}
              type="text"
              value={classCodeInput}
            />
            <input aria-label="Join your class" className={this.submitClass()} name="commit" type="submit" value="Join your class" />
          </form>
        </div>

        <div className="student-info-box">
          <h3><span>Don&#39;t have a class&nbsp;code?</span> <img alt="Lightbulb" src={bulbSrc} /></h3>
          <p>Ask your teacher to share the class code with&nbsp;you.</p>
          <p>To use Quill, a teacher must create a class for&nbsp;you.</p>
        </div>

      </div>
    );
  }
}
