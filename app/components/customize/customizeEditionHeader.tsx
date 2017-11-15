import * as React from 'react';
import { connect } from 'react-redux';

export default class CustomizeEditionHeader extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state={
      showNote: true
    }

    this.closeNote = this.closeNote.bind(this)
  }

  closeNote() {
    this.setState({showNote: false})
  }

  renderNote() {
    if (this.state.showNote) {
      return <div className="note">
        <div className="text">
          <h2>A note about creating your own lessons on Quill</h2>
          <p>You can build your own lesson by creating a customized edition of a Quill Lesson. However, you cannot yet create a new lesson from scratch. The Quill team aims to launch this feature in September 2018. As a work around, Quill provides a <a href="">blank lesson</a> that you can use as a template. <a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson" target="_blank">Learn More</a>.</p>
        </div>
        <div className="image">
          <span onClick={this.closeNote}>Close</span>
          <img src="https://assets.quill.org/images/illustrations/customization-tip.png"/>
        </div>
      </div>
    }
  }

  render() {
    return <div className="customize-edition-header-container">
      <div className='customize-edition-header'>
        <div className="lesson-title-section">
          <p>You are creating an edition of this lesson:</p>
          <h1><span>Lesson {this.props.lessonNumber}:</span>{this.props.lessonTitle}</h1>
        </div>
        <div className="edition-name-and-sample-question-section">
          <p onClick={this.props.showEditModal} className="edit"><i className="fa fa-icon fa-pencil"/>Edit</p>
          <div className="edition-name-and-sample-question" onClick={this.props.showEditModal}>
            <div className="name">
              <p>Edition Name</p>
              <h2>{this.props.editionName || <span>Enter a name</span>}</h2>
            </div>
            <div className="vertical-line"/>
            <div className="sample-question">
              <p>Sample Question</p>
              <h2>{this.props.sampleQuestion || <span>Enter a sample question</span>}</h2>
            </div>
          </div>
        </div>
        {this.renderNote()}
      </div>
    </div>

  }
}
