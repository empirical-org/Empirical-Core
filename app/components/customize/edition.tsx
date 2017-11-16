import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'
import Slide from './slide'
import CustomizeEditionHeader from './customizeEditionHeader'
import NameAndSampleQuestionModal from './nameAndSampleQuestionModal'
import SuccessModal from './successModal'
import {getParameterByName} from '../../libs/getParameterByName'
import {
  Question
} from '../classroomLessons/interfaces'

import {
  setWorkingEdition,
  publishEdition
} from '../../actions/customize'

import {
  setEditionId
} from '../../actions/classroomSessions'

class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const edition = props.customize.editions[props.params.editionID]

    this.state = {
      edition: edition,
      originalEdition: edition,
      showEditModal: false,
      incompleteQuestions: []
    }

    this.updateQuestion = this.updateQuestion.bind(this)
    this.publish = this.publish.bind(this)
    this.resetSlide = this.resetSlide.bind(this)
    this.clearSlide = this.clearSlide.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateSampleQuestion = this.updateSampleQuestion.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
    this.goToSuccessPage = this.goToSuccessPage.bind(this)
  }

  componentWillMount() {
    const classroomActivityId = getParameterByName('classroom_activity_id')
    if (classroomActivityId) {
      setEditionId(classroomActivityId, this.props.params.editionID)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.customize.editions[nextProps.params.editionID], this.props.customize.editions[nextProps.params.editionID])) {
      const edition = nextProps.customize.editions[nextProps.params.editionID]
      if (this.state.edition === undefined || !this.state.edition.data) {
        this.setState({originalEdition: edition, edition: edition}, () => nextProps.dispatch(setWorkingEdition(edition)))
      } else {
        this.setState({originalEdition: edition})
      }
    }
    if (!_.isEqual(nextProps.customize.incompleteQuestions, this.state.incompleteQuestions)) {
      this.setState({incompleteQuestions: nextProps.customize.incompleteQuestions})
    }
  }

  updateQuestion(question: Question, questionIndex: number) {
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

  resetSlide(questionIndex: number) {
    const question = this.state.originalEdition.data.questions[questionIndex].data
    this.updateQuestion(question, questionIndex)
  }

  clearSlide(questionIndex: number) {
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
    const slides = this.state.edition.data.questions.slice(1)
    const incompleteQuestions:Array<number>|never = []
    slides.forEach((s, i) => {
      const q = s.data.play
      if (q.prompt === '' || q.prompt && q.prompt.trim() === '') {
        incompleteQuestions.push(i)
      } else if (!q.prompt && q.html && q.html === '<p></p>' || q.html == '<p><br></p>') {
        incompleteQuestions.push(i)
      }
    })
    this.setState({incompleteQuestions: incompleteQuestions})
    if (incompleteQuestions.length === 0) {
      this.props.dispatch(publishEdition(this.props.params.editionID, this.state.edition, this.goToSuccessPage))
    }
  }

  goToSuccessPage() {
    const classroomActivityId = getParameterByName('classroom_activity_id')
    let link = `/customize/${this.props.params.lessonID}/${this.props.params.editionID}/success`
    link = classroomActivityId ? link.concat(`?&classroom_activity_id=${classroomActivityId}`) : link
    this.props.router.push(link)
  }

  followUpLink() {
    const {lessonID, editionID} = this.props.params
    const classroomActivityID = getParameterByName('classroom_activity_id')
    return classroomActivityID ? `teach/class-lessons/${lessonID}?&classroom_activity_id=${classroomActivityID}` : `teach/class-lessons/${lessonID}/preview/${editionID}`
  }

  renderPublishSection() {
    let text
    if (!this.state.incompleteQuestions || this.state.incompleteQuestions.length === 0) {
      text = <p>Press <span>“Publish Edition</span> to save this lesson. You will see the <span>“Customized”</span> tag next to the name of the lesson.</p>
    } else {
      text = <p className="error"><i className="fa fa-icon fa-exclamation-triangle"/>You have left one of the fields above empty. Please fill out all the required fields and click Publish Edition.</p>
    }
    return <div className="publish-container">
      <div className="publish">
        {text}
        <div className="publish-button" onClick={this.publish}>Publish Edition</div>
      </div>
    </div>
  }

  renderSlides() {
    if (this.state.edition && this.state.edition.data) {
      return this.state.edition.data.questions.slice(1).map((q, i) => this.renderSlide(q, i))
    }
  }

  renderSlide(q: Question, i: number) {
    const incompletePrompt = this.state.incompleteQuestions && this.state.incompleteQuestions.includes(i)
    return <Slide
      key={i}
      question={q}
      questionIndex={i+1}
      updateQuestion={this.updateQuestion}
      clearSlide={this.clearSlide}
      resetSlide={this.resetSlide}
      incompletePrompt={incompletePrompt}
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

  renderSuccessModal() {
    if (window.location.href.indexOf('success') !== -1) {
      const classroomActivityId = getParameterByName('classroom_activity_id')
      const backLink = classroomActivityId
        ? `customize/${this.props.params.lessonID}/${this.props.params.editionID}?&classroom_activity_id=${classroomActivityId}`
        : `customize/${this.props.params.lessonID}/${this.props.params.editionID}`
      return <SuccessModal
        editionName={this.state.edition.name}
        activityName={this.props.classroomLesson.data.title}
        backLink={backLink}
        editionLink={this.followUpLink()}
      />
    }
  }

  render() {
    if (this.state.edition) {

      return <div className="customize-edition-container">
        <div className="customize-edition">
          {this.renderEditModal()}
          {this.renderSuccessModal()}
          <CustomizeEditionHeader
            lessonNumber={this.props.classroomLesson.data.lesson}
            lessonTitle={this.props.classroomLesson.data.title}
            editionName={this.state.edition.name}
            sampleQuestion={this.state.edition.sample_question}
            showEditModal={this.showEditModal}
          />
        {this.renderSlides()}
        {this.renderPublishSection()}
        </div>
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
