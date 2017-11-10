import React, { Component, PropTypes } from 'react';
import NavBar from '../navbar/navbar';
import { connect } from 'react-redux';
import {
  getClassLessonFromFirebase
} from '../../actions/classroomLesson'

import {
  getCurrentUserFromLMS,
  getEditionsByUser
} from '../../actions/customize'

class Customize extends React.Component {
  constructor(props) {
    super(props)
    props.dispatch(getCurrentUserFromLMS())

    if (props.params.lessonID) {
      props.dispatch(getClassLessonFromFirebase(props.params.lessonID))
    }

    this.goToSuccessPage = this.goToSuccessPage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customize.user_id) {
      if (nextProps.customize.user_id !== this.props.customize.user_id || nextProps.classroomLesson && Object.keys(nextProps.classroomLesson.data).length === 0) {
        this.props.dispatch(getEditionsByUser(nextProps.customize.user_id))
      }
    }
  }

  goToSuccessPage() {
    this.props.router.push(`/customize/${this.props.params.lessonID}/${this.props.params.editionID}/success`)
  }

  render() {
    return (
      <div>
        <NavBar params={this.props.params} goToSuccessPage={this.goToSuccessPage}/>
        {this.props.children}
      </div>
    );
  }
}

function select(state) {
  return {
    classroomLesson: state.classroomLesson,
    customize: state.customize
  }
}

export default connect(select)(Customize)
