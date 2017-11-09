import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'
import Slide from './slide'
import CustomizeEditionHeader from './customizeEditionHeader'
import NameAndSampleQuestionModal from './nameAndSampleQuestionModal'

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
      copiedEdition: edition,
      showEditModal: false
    }

    this.updateQuestion = this.updateQuestion.bind(this)
    this.publish = this.publish.bind(this)
    this.resetSlide = this.resetSlide.bind(this)
    this.clearSlide = this.clearSlide.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateSampleQuestion = this.updateSampleQuestion.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
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

  updateName(e) {
    const newEdition = _.merge({}, this.state.edition)
    newEdition.name = e.target.value
    this.setState({edition: newEdition}, () => this.props.dispatch(setWorkingEdition(newEdition)))
  }

  updateSampleQuestion(e) {
    const newEdition = _.merge({}, this.state.edition)
    newEdition.sample_question = e.target.value
    this.setState({edition: newEdition}, () => this.props.dispatch(setWorkingEdition(newEdition)))
  }

  showEditModal() {
    this.setState({showEditModal: true})
  }

  closeEditModal() {
    this.setState({showEditModal: false})
  }

  resetSlide(questionIndex) {
    const question = this.state.copiedEdition.data.questions[questionIndex].data
    this.updateQuestion(question, questionIndex)
  }

  clearSlide(questionIndex) {
    const question = _.merge({}, this.state.edition.data.questions[questionIndex].data)
    const clearedSlide = {}
    Object.keys(question.play).map((k) => {
      if (k === 'cues') {
        clearedSlide[k] = ['']
      } else if (k === 'html') {
        clearedSlide[k] = '<p></p>'
      } else if (k === 'stepLabels') {
        const number = question.play[k].length
        clearedSlide[k] = []
        for (let i = 0; i < number; i++) {
          clearedSlide[k].push('')
        }
      } else if (typeof question.play[k] === 'string') {
        clearedSlide[k] = ''
      } else {
        clearedSlide[k] = question.play[k]
      }
    })
    question.play = clearedSlide
    question.teach.title = ''
    this.updateQuestion(question, questionIndex)
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
    return <Slide
      key={i}
      question={q}
      questionIndex={i+1}
      updateQuestion={this.updateQuestion}
      clearSlide={this.clearSlide}
      resetSlide={this.resetSlide}
    />
  }

  renderEditModal() {
    if (this.state.showEditModal) {
      return <NameAndSampleQuestionModal
          updateName={this.updateName}
          name={this.state.edition.name}
          sampleQuestion={this.state.edition.sample_question}
          updateSampleQuestion={this.updateSampleQuestion}
          buttonClassName
          closeEditModal={this.closeEditModal}
      />
    }
  }

  render() {
    if (this.state.edition) {
      return <div className="customize-edition">
        {this.renderEditModal()}
        <CustomizeEditionHeader
          lessonTitle={this.props.classroomLesson.data.title}
          editionName={this.state.edition.name}
          sampleQuestion={this.state.edition.sample_question}
          showEditModal={this.showEditModal}
        />
      {this.renderSlides()}
      {this.renderPublishSection()}
      </div>
    } else {
      return <span/>
    }
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

export default connect(select)(CustomizeEdition)
