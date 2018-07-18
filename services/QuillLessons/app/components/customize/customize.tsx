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

class Customize extends React.Component<customizeProps> {
  constructor(props: customizeProps) {

    super(props)
    props.dispatch(getCurrentUserAndCoteachersFromLMS())
    // props.dispatch(firebaseAuth())

    if (props.params.lessonID) {
      props.dispatch(getClassLesson(props.params.lessonID))
    }

    const classroomUnitId: string|null = getParameterByName('classroom_unit_id')
    if (classroomUnitId) {
      props.dispatch(startListeningToSession(classroomUnitId))
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
    customize: props.customize,
    classroomSessions: props.classroomSessions
  }
}

export default connect(select)(Customize)
