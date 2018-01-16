import * as React from 'react';
import NavBar from '../navbar/navbar';
import { connect } from 'react-redux';
import {
  getClassLessonFromFirebase
} from '../../actions/classroomLesson'
import {getParameterByName} from '../../libs/getParameterByName'

import {
  getCurrentUserAndCoteachersFromLMS,
  getEditionsForUserIds
} from '../../actions/customize'

interface customizeProps {
  children: any,
  classroomLesson: any,
  customize: any,
  dispatch: any,
  location: any,
  params: any,
  route: any,
  routeParams: any,
  router: any,
  routes: any
}

class Customize extends React.Component<customizeProps> {
  constructor(props: customizeProps) {

    super(props)
    props.dispatch(getCurrentUserAndCoteachersFromLMS())

    if (props.params.lessonID) {
      props.dispatch(getClassLessonFromFirebase(props.params.lessonID))
    }

    this.goToSuccessPage = this.goToSuccessPage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customize.user_id) {
      if (nextProps.customize.user_id !== this.props.customize.user_id || nextProps.classroomLesson && Object.keys(nextProps.classroomLesson.data).length === 0 || !_.isEqual(nextProps.customize.coteachers, this.props.customize.coteachers)) {
        let user_ids = []
        if (nextProps.customize.coteachers.length > 0) {
          user_ids = nextProps.customize.coteachers.map(c => Number(c.id))
        }
        user_ids.push(nextProps.customize.user_id)
        this.props.dispatch(getEditionsForUserIds(user_ids, this.props.params.lessonID))
      }
    } else {
      if (Object.keys(nextProps.customize.editions).length === 0) {
        this.props.dispatch(getEditionsForUserIds([], this.props.params.lessonID))
      }
    }
  }

  goToSuccessPage() {
    const classroomActivityId = getParameterByName('classroom_activity_id')
    let link = `/customize/${this.props.params.lessonID}/${this.props.params.editionID}/success`
    link = classroomActivityId ? link.concat(`?&classroom_activity_id=${classroomActivityId}`) : link
    this.props.router.push(link)
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

function select(props) {
  return {
    classroomLesson: props.classroomLesson,
    customize: props.customize
  }
}

export default connect(select)(Customize)
