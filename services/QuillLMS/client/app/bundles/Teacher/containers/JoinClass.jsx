import React from 'react'
import getAuthToken from '../components/modules/get_auth_token'
import LoadingIndicator from '../components/shared/loading_indicator'

export default class JoinClass extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: null,
      classCodeInput: '',
      loading: false
    }

    this.addClassroom = this.addClassroom.bind(this)
  }

  addClassroom() {
    this.setState({loading: true})
    const data = new FormData()
    data.append('classcode', this.state.classCodeInput)
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
      return { error: 'Oops! You need to be signed in to join a class.' }
    })
    .then((response) => {
      this.setState({loading: false})
      if (response.error) {
        let error
        switch (response.error) {
          case 'Class is archived':
            error = 'Oops! That class has been archived. Please try a different class code.'
            break
          default:
            error = 'Oops! Looks like that isn\'t a valid class code. Please try again.'
            break
        }
        this.setState({ error })
      } else {
        window.location.href = `/classrooms/${response.id}?joined=success`
      }
    })
  }

  errorMessage() {
    if (this.state.error !== null) {
      return <div><span className='error-message'>{this.state.error}</span></div>;
    }
  }


  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }
    return (
      <div id='add-additional-class'>
        <div className='additional-class stage-1 text-center'>
          <h1>Join a New Class</h1>
          <span>Add Your Class Code</span>
          <br/>
          <input id='class_code' className='class-input' onChange={e => this.setState({classCodeInput: e.target.value})} placeholder='e.g. fresh-bread'></input>
          <br/>
          {this.errorMessage()}
          <button className='button-green' onClick={this.addClassroom}>Join Your Class</button>
          <br/>
          <span>Don't know your classcode?<br/>
            You can ask your teacher for it.</span>
        </div>
      </div>
    );
  }

}
