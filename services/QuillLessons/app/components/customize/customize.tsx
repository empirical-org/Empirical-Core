import * as React from 'react';
import NavBar from '../navbar/navbar';
import * as _ from 'lodash'
import { connect } from 'react-redux';
import {
  getClassLesson
} from '../../actions/classroomLesson'
import {
  startListeningToSession
} from '../../actions/classroomSessions'
import {getParameterByName} from '../../libs/getParameterByName'
import {
  ClassroomSessionId,
  ClassroomUnitId
} from '../classroomLessons/interfaces'

import {
  getCurrentUserAndCoteachersFromLMS,
  getEditionMetadataForUserIds
} from '../../actions/customize'

interface customizeProps {
  children: any,
  classroomLesson: any,
  classroomSessions: any,
  customize: any,
  dispatch: any,
  location: any,
  params: any,
  route: any,
  routeParams: any,
  router: any,
  routes: any
}

interface customizeState {
  classroomUnitId: ClassroomUnitId|null,
  classroomSessionId: ClassroomSessionId|null
}

class Customize extends React.Component<customizeProps, customizeState> {
  constructor(props: customizeProps) {

    super(props)

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.params.lessonID
    const classroomSessionId: ClassroomSessionId|null = classroomUnitId ? classroomUnitId.concat(activityUid) : null
    this.state = {
      classroomUnitId,
      classroomSessionId
    }

    props.dispatch(getCurrentUserAndCoteachersFromLMS())
    // props.dispatch(firebaseAuth())

    if (activityUid) {
      props.dispatch(getClassLesson(activityUid))
    }

    if (classroomSessionId) {
      props.dispatch(startListeningToSession(classroomSessionId))
    }

    this.goToSuccessPage = this.goToSuccessPage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customize.user_id) {
      if (nextProps.customize.user_id !== this.props.customize.user_id || !_.isEqual(nextProps.customize.coteachers, this.props.customize.coteachers)) {
        let user_ids:Array<Number>|never = []
        if (nextProps.customize.coteachers.length > 0) {
          user_ids = nextProps.customize.coteachers.map(c => Number(c.id))
        }
        user_ids.push(nextProps.customize.user_id)
        this.props.dispatch(getEditionMetadataForUserIds(user_ids, this.props.params.lessonID))
      }
    } else {
      if (Object.keys(nextProps.customize.editions).length === 0) {
        this.props.dispatch(getEditionMetadataForUserIds([], this.props.params.lessonID))
      }
    }
  }

  goToSuccessPage() {
    const classroomUnitId = getParameterByName('classroom_unit_id')
    let link = `/customize/${this.props.params.lessonID}/${this.props.params.editionID}/success`
    link = classroomUnitId ? link.concat(`?&classroom_unit_id=${classroomUnitId}`) : link
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
    customize: props.customize,
    classroomSessions: props.classroomSessions
  }
}

export default connect(select)(Customize)
