'use strict'

import React from 'react'

import AddClassSection from './add_class_section.jsx'

export default class extends React.Component {
  state = {showModal: false};

  hideModal = () => {
    this.setState({showModal: false});
  };

  render() {
      return (
        <div className={"mini_container add-or-import col-md-4 col-sm-5 text-center"}>
          <AddClassSection />
          <span>or</span>
          <a className='dashed' href="/teachers/classrooms?modal=google-classroom">
            <div id="google-classroom-mini">
              <img alt="google sync" src="/images/google_sync_icon.svg" />
              <h3>Sync Classrooms from <br /> Google Classroom</h3>
            </div>
          </a>
        </div>
      );}
}
