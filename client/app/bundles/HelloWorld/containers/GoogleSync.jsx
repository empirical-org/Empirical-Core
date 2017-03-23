import React from 'react'
import $ from 'jquery'
import LoadingIndicator from '../components/shared/loading_indicator.jsx'
import GoogleClassroomList from '../components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx'
import {authForGoogleSyncPage} from '../components/modules/google_authentication.js'
require('../../../assets/styles/app-variables.scss')


export default class extends React.Component{
  constructor(){
    super()
  }

  state = {loading: true}

  componentDidMount(){
    this.getGoogleClassrooms()
  }

  getGoogleClassrooms(){
    const that = this;
    $.get('/teachers/classrooms/retrieve_google_classrooms', (data) => {
      if (data.errors === 'UNAUTHENTICATED') {
        authForGoogleSyncPage();
      }
      that.setState({classrooms: data.classrooms})
    })
    .fail((data)=>{
      that.setState({error: data.errors})
    })
    .always(()=>{
      that.setState({loading: false})
    })
    ;
  }

  loadingIndicatorOrContent(){
    if (this.state.loading) {
      return <LoadingIndicator/>
    } else if (this.state.errors) {
      return <div>Google has returned the following error</div>
    } else {
      return this.content()
    }
  }

  content(){
    return (
      <div>
        <h3>Choose Which Google Classrooms To Sync</h3>
        <p>Select all of the classes that you would like to sync with Google Classroom</p>
        <GoogleClassroomList classrooms={this.state.classrooms}/>
      </div>
    )
  }

  render(){
    return(<div className='google-sync'>
      {this.loadingIndicatorOrContent()}
    </div>)
  }
}
