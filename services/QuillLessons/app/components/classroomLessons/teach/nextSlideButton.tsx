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
import {Mutation} from 'react-apollo'
import CHANGE_SLIDE_NUMBER from '../mutations/changeSlideNumber';

interface NextSlideButtonProps {
  [key:string]: any;
}

class NextSlideButton extends React.Component<StateFromProps & NextSlideButtonProps, any> {
  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.params.lessonID
    this.state = {
      classroomUnitId,
      classroomSessionId: classroomUnitId ? classroomUnitId.concat(activityUid) : null
    }

    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  goToNextSlide() {
    const classroomSessionId: ClassroomSessionId|null = this.state.classroomSessionId;
    const sessionData: ClassroomLessonSession = this.props.session;
    const editionData: EditionQuestions = this.props.edition;
    if (classroomSessionId) {
      const updateInStore = goToNextSlide(sessionData, editionData, classroomSessionId);
      if (updateInStore) {
        this.props.dispatch(updateInStore);
      }
    }
  }

  renderNextSlideButton() {
    return (
      <Mutation mutation={CHANGE_SLIDE_NUMBER}>
        {(ChangeSlideNumber, {data}) => (
          <button onClick={
            e => {
              ChangeSlideNumber({variables: {
                id: this.state.classroomSessionId,
                slideNumber: `${parseInt(this.props.session.current_slide) + 1}`
              }})
            }
          }>Next Slide</button>
        )}
        
      </Mutation>
    )
  }

  render() {
    const data = this.props.session;
    const editionData = this.props.edition;
    if (editionData.questions && Number(data.current_slide) === editionData.questions.length - 1) {
      return <span />;
    } else if (Number(data.current_slide) === 0) {
      return <span>Press the <span>right arrow key</span> to continue to the next slide.{this.renderNextSlideButton()}</span>
    }
    return this.renderNextSlideButton();
  }
}

function select(props) {
  return {
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {

}

export interface StateFromProps {
}


export default connect<StateFromProps, DispatchFromProps, NextSlideButtonProps>(select, dispatch => ({dispatch}))(NextSlideButton);
