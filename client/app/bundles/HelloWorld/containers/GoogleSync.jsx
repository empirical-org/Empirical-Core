import React from 'react'
import $ from 'jquery'
import LoadingIndicator from '../components/shared/loading_indicator.jsx'
import GoogleClassroomList from '../components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx'


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
      that.setState({classrooms: data.classrooms})
    })
    .fail((data)=>{
      that.setState({error: data.error})
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
      // error page
    } else {
      return <GoogleClassroomList classrooms={this.state.classrooms}/>
    }
  }

  render(){
    return(<div>
      We're on the Google Sync page!!!!
      {this.loadingIndicatorOrContent()}
    </div>)
  }
}
