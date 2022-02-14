declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
const helpIcon = 'https://assets.quill.org/images/icons/help_icon.svg'
import { getParameterByName } from '../../libs/getParameterByName';
import {
  publishEdition,
  setIncompleteQuestions
} from '../../actions/customize'
import { formatDateTime } from '../customize/helpers'

class CustomizeNavbar extends React.Component<any, any> {
  editionMetadata() {
    const { customize, match, } = this.props
    return customize.editions[match.params.editionID]
  }

  goToSuccessPage = () => {
    const classroomUnitId = getParameterByName('classroom_unit_id')
    let link = `/customize/${this.props.match.params.lessonID}/${this.props.match.params.editionID}/success`
    link = classroomUnitId ? link.concat(`?&classroom_unit_id=${classroomUnitId}`) : link
    this.props.history.push(link)
  }

  handlePublishClick = () => {
    const { customize, dispatch, match, } = this.props
    const { params, } = match
    const slides = customize.workingEditionQuestions.questions.slice(1)
    const incompleteQuestions:Array<number>|never = []
    slides.forEach((s, i) => {
      const q = s.data.play
      if (q.prompt === '' || q.prompt && q.prompt.trim() === '' || q.prompt === '<p></p>' || q.prompt == '<p><br></p>') {
        incompleteQuestions.push(i)
      } else if (!q.prompt && q.html && q.html === '<p></p>' || q.html == '<p><br></p>') {
        incompleteQuestions.push(i)
      }
    })
    if (incompleteQuestions.length === 0 && customize.workingEditionMetadata.name) {
      dispatch(publishEdition(params.editionID, customize.workingEditionMetadata, customize.workingEditionQuestions, this.goToSuccessPage))
    } else {
      dispatch(setIncompleteQuestions(incompleteQuestions))
    }
  }

  lastPublishedAt() {
    if (this.editionMetadata() && this.editionMetadata().last_published_at) {
      const formattedTime = formatDateTime(this.editionMetadata().last_published_at)
      return <span>Last published on {formattedTime}</span>
    }
  }

  renderPublishButton() {
    return <div className="publish-button" onClick={this.handlePublishClick}>Publish Edition</div>
  }

  render() {
    /* eslint-disable react/jsx-no-target-blank */
    const supportLink = (<a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson" target="_blank">
      <img alt="" className="he)lp" src={helpIcon} />Help
    </a>)
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="customize-navbar-container">
        <div className="customize-navbar">
          <div className="left">
            <span>Create Customized Edition</span>
            <span className="vertical-line" />
            <span>
              {supportLink}
            </span>
          </div>
          <div className="right">
            {this.lastPublishedAt()}
            {this.renderPublishButton()}
          </div>
        </div>
      </div>
    )
  }

}

function select(props) {
  return {
    customize: props.customize,
    classroomLesson: props.classroomLesson,
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default withRouter(connect(select, dispatch => ({dispatch}), mergeProps)(CustomizeNavbar))
