import * as React from 'react';

export default class CustomizeEditionHeader extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      showNote: true
    }
  }

  handleCloseNoteClick = () => {
    this.setState({showNote: false})
  }

  renderBackButton() {
    if (window.history.length > 1) {
      return (
        <div className="back-button">
          <span onClick={this.handleBackClick}>
            <i className="fa fa-icon fa-chevron-left" />
          Back
          </span>
        </div>
      )
    }
  }

  handleBackClick = () => {
    window.history.back()
  }

  renderNote() {
    const { showNote, } = this.state
    if (!showNote) { return }
    /* eslint-disable react/jsx-no-target-blank */
    const paragraphWithLink = <p>You can build your own lesson by creating a customized edition of a Quill Lesson. However, you cannot yet create a new lesson from scratch. <a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson" target="_blank">Learn More</a>.</p>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="note">
        <div className="text">
          <h2>A note about creating your own lessons on Quill</h2>
          {paragraphWithLink}
        </div>
        <div className="image">
          <span onClick={this.handleCloseNoteClick}>Close</span>
          <img alt="" src="https://assets.quill.org/images/illustrations/customization-tip-x2.png" />
        </div>
      </div>
    )
  }

  render() {
    const { editionName, lessonNumber, showEditModal, lessonTitle, sampleQuestion, } = this.props
    const errorClass = editionName ? '' : 'missing-name'
    return (
      <div className="customize-edition-header-container">
        <div className='customize-edition-header'>
          {this.renderBackButton()}
          <div className="lesson-title-section">
            <p>You are creating an edition of this lesson:</p>
            <h1><span>Lesson {lessonNumber}:</span>{lessonTitle}</h1>
          </div>
          <div className="edition-name-and-sample-question-section">
            <p className="edit"><button className="interactive-wrapper focus-on-light" onClick={showEditModal} type="button"><i className="fa fa-icon fa-pencil" />Edit</button></p>
            <div className={`edition-name-and-sample-question ${errorClass}`} onClick={showEditModal}>
              <div className="name">
                <p>Edition Name</p>
                <h2>{editionName || <span>Enter a name</span>}</h2>
              </div>
              <div className="vertical-line" />
              <div className="sample-question">
                <p>Sample Question</p>
                <h2>{sampleQuestion || <span>Enter a sample question</span>}</h2>
              </div>
            </div>
          </div>
          {this.renderNote()}
        </div>
      </div>
    )

  }
}
