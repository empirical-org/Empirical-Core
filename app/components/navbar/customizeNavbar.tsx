declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
const helpIcon = require('../../img/help_icon.svg')
import { getParameterByName } from '../../libs/getParameterByName';
import {
  publishEdition,
  setIncompleteQuestions
 } from '../../actions/customize'
import { formatDateTime } from '../customize/helpers'

class CustomizeNavbar extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.publish = this.publish.bind(this)
  }

  edition() {
    return this.props.customize.editions[this.props.params.editionID]
  }

  publish() {
    const slides = this.props.customize.workingEdition.data.questions.slice(1)
    const incompleteQuestions:Array<number>|never = []
    slides.forEach((s, i) => {
      const q = s.data.play
      if (q.prompt === '' || q.prompt && q.prompt.trim() === '') {
        incompleteQuestions.push(i)
      } else if (!q.prompt && q.html && q.html === '<p></p>' || q.html == '<p><br></p>') {
        incompleteQuestions.push(i)
      }
    })
    if (incompleteQuestions.length === 0) {
      this.props.dispatch(publishEdition(this.props.params.editionID, this.props.customize.workingEdition, this.props.goToSuccessPage))
    } else {
      this.props.dispatch(setIncompleteQuestions(incompleteQuestions))
    }
  }

  lastPublishedAt() {
    if (this.edition() && this.edition().last_published_at) {
      const formattedTime = formatDateTime(this.edition().last_published_at)
      return <span>Last published on {formattedTime}</span>
    }
  }

  renderPublishButton() {
    return <div className="publish-button" onClick={this.publish}>Publish Edition</div>
  }

  render() {
    return <div className="customize-navbar-container">
      <div className="customize-navbar">
        <div className="left">
          <span>Create Customized Edition</span>
          <span className="vertical-line"></span>
          <span>
            <a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson">
              <img className="help" src={helpIcon}/>Help
            </a>
          </span>
        </div>
        <div className="right">
          {this.lastPublishedAt()}
          {this.renderPublishButton()}
        </div>
      </div>
    </div>
  }

}

function select(props) {
  return {
    customize: props.customize,
    classroomLesson: props.classroomLesson,
  };
}


export default connect(select)(CustomizeNavbar);
