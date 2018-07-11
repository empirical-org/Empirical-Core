import * as React from 'react'
import { saveReview } from '../../../actions/classroomSessions';
import { getParameterByName } from '../../../libs/getParameterByName';

export default class CongratulationsModal extends React.Component<{closeModal: any, lessonId:string}, {selectedEmoji: number|null}> {
  constructor(props) {
    super(props)

    this.state = {
      selectedEmoji: null,
    }

    this.selectEmoji = this.selectEmoji.bind(this)
    this.renderFeedbackSection = this.renderFeedbackSection.bind(this)
  }

  selectEmoji(value:number) {
    this.setState({selectedEmoji: value})
    const classroomActivityId = getParameterByName('classroom_activity_id')
    if (classroomActivityId) {
      saveReview(this.props.lessonId, classroomActivityId, value)
    }
  }

  renderFeedbackResponse() {
    let text
    if (this.state.selectedEmoji === 2) {
      text = <p>We are happy to hear that you had a good experience with Quill Lessons. Please share your feedback, suggestions or report any bugs by clicking on the link below.</p>
    } else {
      text = <p>We are sorry to hear that you did not have a good experience with Quill Lessons. Please share your feedback, suggestions or report any bugs by clicking on the link below.</p>
    }
    return <div className="feedback-response">
      <p>Thank you!</p>
      {text}
      <a href="https://goo.gl/forms/n5xkhRBMg8V4v0Fj1" target="_blank">Share Your Feedback</a>
    </div>
  }

  renderFeedbackSection() {
    switch (this.state.selectedEmoji) {
      case 2:
      case 1:
      case 0:
        return this.renderFeedbackResponse()
      default:
        return <div className="feedback">
         <p>How was your experience with Quill Lessons?</p>
         <p>We are eager to hear your feedback to improve this tool.</p>
         <div className="emoji-row">
           <img onClick={() => this.selectEmoji(0)} src="https://assets.quill.org/images/emojis/disappointed_face.png"/>
           <img onClick={() => this.selectEmoji(1)} src="https://assets.quill.org/images/emojis/neutral_face.png"/>
           <img onClick={() => this.selectEmoji(2)} src="https://assets.quill.org/images/emojis/inlove_face.png"/>
         </div>
        </div>
    }
  }

  render() {
    return <div className="congratulations-modal-container">
         <div className="congratulations-modal-background" onClick={this.props.closeModal}/>
        <div className="congratulations-modal">
           <img onClick={this.props.closeModal} className="exit" src="https://assets.quill.org/images/icons/CloseIcon.svg"/>
           <img className="illustration" src="https://assets.quill.org/images/illustrations/congratulations_illustration.svg" />
           <h1 className="congratulations">Congratulations!</h1>
           <h1>You've completed a Quill Lessons Activity.</h1>
           <p>This lesson will be marked as complete for your students.</p>
           <div className="dividing-line"/>
           <p>Your students' answers in this lesson are now saved in the <span>Activity Analysis</span> reports.</p>
           {this.renderFeedbackSection()}
        </div>
      </div>
  }
}
