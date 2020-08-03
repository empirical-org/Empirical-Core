import * as React from 'react'
import { saveReview } from '../../../actions/classroomSessions';
import { ClassroomSessionId } from '../interfaces'

export default class CongratulationsModal extends React.Component<{closeModal: any, lessonId:string, classroomSessionId:ClassroomSessionId}, {selectedEmoji: number|null}> {
  constructor(props) {
    super(props)

    this.state = {
      selectedEmoji: null,
    }
  }

  selectEmoji = (value:number) => {
    const { classroomSessionId, lessonId, } = this.props
    this.setState({selectedEmoji: value})
    if (classroomSessionId) {
      saveReview(lessonId, classroomSessionId, value)
    }
  }

  handleDisappointedEmojiClick = () => this.selectEmoji(0)

  handleNeutralEmojiClick = () => this.selectEmoji(1)

  handleHappyEmojiClick = () => this.selectEmoji(2)

  renderFeedbackResponse = () => {
    const { selectedEmoji, } = this.state
    let text
    if (selectedEmoji === 2) {
      text = <p>We are happy to hear that you had a good experience with Quill Lessons. Please share your feedback, suggestions or report any bugs by clicking on the link below.</p>
    } else {
      text = <p>We are sorry to hear that you did not have a good experience with Quill Lessons. Please share your feedback, suggestions or report any bugs by clicking on the link below.</p>
    }
    return (<div className="feedback-response">
      <p>Thank you!</p>
      {text}
      <a href="https://goo.gl/forms/n5xkhRBMg8V4v0Fj1" rel="noopener noreferrer" target="_blank">Share Your Feedback</a>
    </div>)
  }

  renderFeedbackSection = () => {
    const { selectedEmoji, } = this.state
    switch (selectedEmoji) {
      case 2:
      case 1:
      case 0:
        return this.renderFeedbackResponse()
      default:
        return (<div className="feedback">
          <p>How was your experience with Quill Lessons?</p>
          <p>We are eager to hear your feedback to improve this tool.</p>
          <div className="emoji-row">
            <img onClick={this.handleDisappointedEmojiClick} src="https://assets.quill.org/images/emojis/disappointed_face.png" />
            <img onClick={this.handleNeutralEmojiClick} src="https://assets.quill.org/images/emojis/neutral_face.png" />
            <img onClick={this.handleHappyEmojiClick} src="https://assets.quill.org/images/emojis/inlove_face.png" />
          </div>
        </div>)
    }
  }

  render() {
    const { closeModal, } = this.props
    return (<div className="congratulations-modal-container">
      <div className="congratulations-modal-background" onClick={closeModal} />
      <div className="congratulations-modal">
        <img className="exit" onClick={closeModal} src="https://assets.quill.org/images/icons/CloseIcon.svg" />
        <img className="illustration" src="https://assets.quill.org/images/illustrations/congratulations_illustration.svg" />
        <h1 className="congratulations">Congratulations!</h1>
        <h1>You&#39;ve completed a Quill Lessons Activity.</h1>
        <p>This lesson will be marked as complete for your students.</p>
        <div className="dividing-line" />
        <p>Your students&#39; answers in this lesson are now saved in the <span>Activity Analysis</span> reports.</p>
        {this.renderFeedbackSection()}
      </div>
    </div>)
  }
}
