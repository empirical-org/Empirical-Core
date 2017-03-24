import React from 'react'
import $ from 'jquery'
import LoadingIndicator from '../components/shared/loading_indicator.jsx'
import GoogleClassroomList from '../components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx'
import ArchiveClassesWarning from '../components/google_classroom/google_classroom_sync/ArchiveClassesWarning.jsx'
import {authForGoogleSyncPage} from '../components/modules/google_authentication.js'
import Modal from 'react-bootstrap/lib/Modal'


require('../../../assets/styles/app-variables.scss')


export default class extends React.Component{
  constructor(){
    super()
    this.hideModal = this.hideModal.bind(this);
    this.syncClassroomsAjax = this.syncClassroomsAjax.bind(this);
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

  syncClassroomsAjax() {
    const that = this
    const selectedClassrooms = JSON.stringify(this.state.classData.selectedClassrooms)
    $.ajax({
      type: 'post',
      data: {selected_classrooms: selectedClassrooms},
      url: '/teachers/classrooms/update_google_classrooms',
      statusCode: {
        200: function() {
          that.syncClassroomSuccess()
          }
      }
    })
  }

  syncClassrooms = (classData) => {
    this.setState(
      {classData},
      ()=>{
        if (!this.modalWarning()) {
          // modal warning triggers a modal if the user has unchecked existing classes
          this.syncClassroomsAjax()
        }
      })
  }

  modalWarning = () => {
    if (this.state.classData.archivedCount > 0) {
      this.setState({showModal: true})
    }
  }

  hideModal() {
    this.setState({showModal: false})
  }

  syncClassroomSuccess = () => {
    $.ajax({
      type: 'get',
      url: '/teachers/classrooms/import_google_students'
    })
  }

  content(){
    return (
      <div>
        <h3>Choose Which Google Classrooms To Sync</h3>
        <p>Select all of the classes that you would like to sync with Google Classroom</p>
        <GoogleClassroomList classrooms={this.state.classrooms} syncClassrooms={this.syncClassrooms}/>
        <p>If  you deselect a classroom, the classroom will be archived on Quill and will no longer sync data with Google Classroom.</p>
        <ArchiveClassesWarning show={this.state.showModal} classData={this.state.classData} syncClassroomsAjax={this.syncClassroomsAjax} hideModal={this.hideModal} />
      </div>
    )
  }

  render(){
    return(<div className='google-sync'>
      {this.loadingIndicatorOrContent()}
    </div>)
  }
}
