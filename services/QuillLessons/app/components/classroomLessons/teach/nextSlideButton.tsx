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
import { Lesson, Edition } from './dataContainer';

interface NextSlideButtonProps {
  params: any
  lesson: Lesson
  edition: Edition
  session: ClassroomLessonSession
}

class NextSlideButton extends React.Component<NextSlideButtonProps, any> {
  constructor(props) {
    super(props);
  }

  renderNextSlideButton() {
    return (
      <Mutation mutation={CHANGE_SLIDE_NUMBER}>
        {(ChangeSlideNumber, {data}) => (
          <button onClick={
            e => {
              ChangeSlideNumber({variables: {
                id: this.props.session.id,
                slideNumber: `${parseInt(this.props.session.current_slide) + 1}`
              }})
            }
          }>Next Slide</button>
        )}
        
      </Mutation>
    )
  }

  render() {
    const {current_slide} = this.props.session;
    const {questions} = this.props.edition;
    if (questions && Number(current_slide) === questions.length - 1) {
      return <span />;
    } else if (Number(current_slide) === 0) {
      return <span>Press the <span>right arrow key</span> to continue to the next slide.{this.renderNextSlideButton()}</span>
    }
    return this.renderNextSlideButton();
  }
}

export default NextSlideButton;
