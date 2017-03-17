import React from 'react'
import $ from 'jquery'
import LoadingIndicator from '../components/shared/loading_indicator.jsx'


export default class extends React.Component{
  constructor(){
    super()
    this.getGoogleClassrooms()
  }

  state = {loading: true}

  getGoogleClassrooms(){
    $.get('/teachers/classrooms/retrieve_google_classrooms', (data) => {
            
);
  }

  loadingIndicatorOrContent(){
    if (this.state.loading) {
      return <LoadingIndicator/>
    }
  }

  render(){
    return(<div>
      We're on the Google Sync page!!!!
      {this.loadingIndicatorOrContent()}
    </div>)
  }
}
