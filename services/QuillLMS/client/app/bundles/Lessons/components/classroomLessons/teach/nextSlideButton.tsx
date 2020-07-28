import * as React from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from '../../../libs/getParameterByName';
import { goToNextSlide } from '../../../actions/classroomSessions';
import {
  ClassroomLessonSession,
  ClassroomUnitId,
  ClassroomSessionId
} from '../interfaces'
import {
  EditionQuestions
} from '../../../interfaces/customize'

interface NextSlideButtonProps {
  [key:string]: any;
}

class NextSlideButton extends React.Component<StateFromProps & NextSlideButtonProps, any> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    this.state = {
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  goToNextSlide() {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    const sessionData: ClassroomLessonSession = this.props.classroomSessions.data;
    const editionData: EditionQuestions = this.props.customize.editionQuestions;
    if (classroomSessionId) {
      const updateInStore = goToNextSlide(sessionData, editionData, classroomSessionId);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  render() {
    const data = this.props.classroomSessions.data;
    const editionData = this.props.customize.editionQuestions
    if (editionData.questions && Number(data.current_slide) === editionData.questions.length - 1) {
      return <span />;
    } else if (Number(data.current_slide) === 0) {
      return <span>Press the <span>right arrow key</span> to continue to the next slide.<button onClick={this.goToNextSlide}>Next Slide</button></span>
    }
    return (
      <button onClick={this.goToNextSlide}>Next Slide</button>
    );
  }
}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    customize: props.customize,
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {

}

export interface StateFromProps {
  customize: any
  classroomSessions: any
}


export default connect<StateFromProps, DispatchFromProps, NextSlideButtonProps>(select, dispatch => ({dispatch}))(NextSlideButton);
