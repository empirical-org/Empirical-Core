import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'
import Slide from './slide'

import {
  setWorkingEdition,
  publishEdition
} from '../../actions/customize'

class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const edition = props.customize.editions[props.params.editionID]

    this.state = {
      edition: edition,
      copiedEdition: edition
    }

    this.updateQuestion = this.updateQuestion.bind(this)
    this.publish = this.publish.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.customize.editions[nextProps.params.editionID], this.props.customize.editions[nextProps.params.editionID])) {
      const edition = nextProps.customize.editions[nextProps.params.editionID]
      if (this.state.edition === undefined) {
        this.setState({copiedEdition: edition, edition: edition}, () => nextProps.dispatch(setWorkingEdition(edition)))
      } else {
        this.setState({copiedEdition: edition})
      }
    }
  }

  updateQuestion(question, questionIndex) {
    const newEdition = _.merge({}, this.state.edition)
    newEdition.data.questions[questionIndex].data = question
    this.setState({edition: newEdition}, () => this.props.dispatch(setWorkingEdition(newEdition)))
  }

  publish() {
    publishEdition(this.props.params.editionID, this.state.edition)
  }

  renderPublishSection() {
    return <div className="publish">
      <p>Press <span>“Publish Customization”</span> to save this lesson. You will see the <span>“Customized”</span> tag next to the name of the lesson.</p>
      <div className="publish-button" onClick={this.publish}>Publish Edition</div>
    </div>
  }

  renderSlides() {
    if (this.state.edition) {
      return this.state.edition.data.questions.slice(1).map((q, i) => this.renderSlide(q, i))
    }
  }

  renderSlide(q, i) {
    return <Slide question={q} questionIndex={i+1} updateQuestion={this.updateQuestion}/>
  }

  render() {
    return <div className="customize-edition">
    {this.renderSlides()}
    {this.renderPublishSection()}
    </div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

export default connect(select)(CustomizeEdition)
