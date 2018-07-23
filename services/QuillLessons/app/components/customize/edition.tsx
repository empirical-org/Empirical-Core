import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'
import Slide from './slide'
import CustomizeEditionHeader from './customizeEditionHeader'
import NameAndSampleQuestionModal from './nameAndSampleQuestionModal'
import SuccessModal from './successModal'
import { getParameterByName } from '../../libs/getParameterByName'
import { Question } from '../classroomLessons/interfaces'

import {
  getEditionMetadata,
  getEditionMetadataForUserIds,
  getEditionQuestions,
  publishEdition,
  setEditionMetadata,
  setEditionQuestions,
  setIncompleteQuestions,
  setOriginalEditionQuestions,
  setWorkingEditionMetadata,
  setWorkingEditionQuestions,
} from '../../actions/customize'

import {
  setEditionId,
  setTeacherModels,
} from '../../actions/classroomSessions'

import {
  getStoredEditionMetadata,
  getIncompleteQuestions,
  getStoredEditionQuestions,
  getStoredOriginalEditionQuestions,
} from '../../reducers/combined'

class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = { showEditModal: false };

    this.updateQuestion = this.updateQuestion.bind(this)
    this.publish = this.publish.bind(this)
    this.resetSlide = this.resetSlide.bind(this)
    this.clearSlide = this.clearSlide.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateSampleQuestion = this.updateSampleQuestion.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
    this.goToSuccessPage = this.goToSuccessPage.bind(this)
    this.afterPublishing = this.afterPublishing.bind(this)
  }

  componentWillMount() {
    const classroomUnitId = getParameterByName('classroom_unit_id');
    if (classroomUnitId) {
      setEditionId(classroomUnitId, this.props.params.editionID);
    }

    this.props.dispatch(getEditionMetadata(
      this.props.params.lessonID,
      this.props.params.editionID
    ));

    this.props.dispatch(getEditionQuestions(this.props.params.editionID));
    this.props.dispatch(setOriginalEditionQuestions(this.props.editionQuestions));
  }

  componentWillReceiveProps(nextProps) {
    const hasNewEdition = !_.isEqual(
      nextProps.editionMetadata,
      this.props.editionMetadata
    );

    const isEditionUndefined = this.props.editionMetadata === undefined;
    const isMissingQuestions = !this.props.editionQuestions.questions;

    if (hasNewEdition && isEditionUndefined) {
      this.props.dispatch(setEditionQuestions(nextProps.editionQuestions));
      this.props.dispatch(setWorkingEditionQuestions(nextProps.editionQuestions));
      this.props.dispatch(setWorkingEditionMetadata(nextProps.editionMetadata));
    }

    if (hasNewEdition && isMissingQuestions) {
      this.props.dispatch(setEditionQuestions(nextProps.editionQuestions));
      this.props.dispatch(setWorkingEditionQuestions(nextProps.editionQuestions));
    }
  }

  updateQuestion(question: Question, questionIndex: number) {
    const newEditionQuestions = _.merge({}, this.props.editionQuestions)
    newEditionQuestions.questions[questionIndex].data = question
    this.props.dispatch(setEditionQuestions(newEditionQuestions));
    this.props.dispatch(setWorkingEditionQuestions(newEditionQuestions));
  }

  updateName(e) {
    const newEditionMetadata = _.merge({}, this.props.editionMetadata)
    newEditionMetadata.name = e.target.value
    this.props.dispatch(setEditionMetadata(newEditionMetadata));
    this.props.dispatch(setWorkingEditionMetadata(newEditionMetadata));
  }

  updateSampleQuestion(e) {
    const newEditionMetadata = _.merge({}, this.props.editionMetadata)
    newEditionMetadata.sample_question = e.target.value
    this.props.dispatch(setEditionMetadata(newEditionMetadata));
    this.props.dispatch(setWorkingEditionMetadata(newEditionMetadata));
  }

  showEditModal() {
    this.setState({ showEditModal: true });
  }

  closeEditModal() {
    this.setState({ showEditModal: false });
  }

  resetSlide(questionIndex: number) {
    const question = this.props.originalEditionQuestions.questions[questionIndex].data
    if (question) {
      question.reset = true
    }

    this.updateQuestion(question, questionIndex)
  }

  clearSlide(questionIndex: number) {
    const question = _.merge({}, this.props.editionQuestions.questions[questionIndex].data)
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
    const slides = this.props.editionQuestions.questions.slice(1);
    const incompleteQuestions:Array<number>|never = [];

    slides.forEach((slide, i) => {
      let question = slide.data.play;
      let isIncomplete = (
          question.prompt === '' ||
          question.prompt &&
          question.prompt.trim() === '' ||
          question.prompt === '<p></p>' ||
          question.prompt == '<p><br></p>'
        ) || (
          !question.prompt &&
          question.html &&
          question.html === '<p></p>' ||
          question.html == '<p><br></p>'
        );

      if (isIncomplete) {
        incompleteQuestions.push(i);
      }
    });

    this.props.dispatch(setIncompleteQuestions(incompleteQuestions));

    if (incompleteQuestions.length === 0 && this.props.editionMetadata.name) {
      this.props.dispatch(publishEdition(
        this.props.params.editionID,
        this.props.editionMetadata,
        this.props.editionQuestions,
        this.afterPublishing
      ));
    }
  }

  afterPublishing() {
    const classroomUnitId = getParameterByName('classroom_unit_id')
    setTeacherModels(classroomUnitId, this.props.params.editionID)
    this.goToSuccessPage()
  }

  goToSuccessPage() {
    const classroomUnitId = getParameterByName('classroom_unit_id')
    let link = `/customize/${this.props.params.lessonID}/${this.props.params.editionID}/success`
    link = classroomUnitId ? link.concat(`?&classroom_unit_id=${classroomUnitId}`) : link
    this.props.router.push(link)
  }

  followUpLink() {
    const {lessonID, editionID} = this.props.params
    const classroomUnitId = getParameterByName('classroom_unit_id')
    return classroomUnitId ? `teach/class-lessons/${lessonID}?&classroom_unit_id=${classroomUnitId}` : `teach/class-lessons/${lessonID}/preview/${editionID}`
  }

  renderPublishSection() {
    let text
    if (this.props.editionMetadata.name && (!this.props.incompleteQuestions || this.props.incompleteQuestions.length === 0)) {
      text = <p>Press <span>"Publish Edition"</span> to save this lesson. You will see the <span>“Customized”</span> tag next to the name of the lesson.</p>
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
    if (this.props.editionQuestions && this.props.editionQuestions.questions) {
      return this.props.editionQuestions.questions.slice(1).map((q, i) => this.renderSlide(q, i))
    }
  }

  renderSlide(q: Question, i: number) {
    const incompletePrompt = this.props.incompleteQuestions && this.props.incompleteQuestions.includes(i)
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
      const buttonClassName = this.props.editionMetadata.name ? 'active' : 'inactive'
      return <NameAndSampleQuestionModal
          updateName={this.updateName}
          name={this.props.editionMetadata.name}
          sampleQuestion={this.props.editionMetadata.sample_question}
          updateSampleQuestion={this.updateSampleQuestion}
          buttonClassName={buttonClassName}
          closeEditModal={this.closeEditModal}
      />
    }
  }

  renderSuccessModal() {
    if (window.location.href.indexOf('success') !== -1) {
      const classroomUnitId = getParameterByName('classroom_unit_id')
      const backLink = classroomUnitId
        ? `customize/${this.props.params.lessonID}/${this.props.params.editionID}?&classroom_unit_id=${classroomUnitId}`
        : `customize/${this.props.params.lessonID}/${this.props.params.editionID}`
      return <SuccessModal
        editionName={this.props.editionMetadata.name}
        activityName={this.props.classroomLesson.data.title}
        backLink={backLink}
        editionLink={this.followUpLink()}
      />
    }
  }

  render() {
    if (this.props.editionMetadata) {
      return <div className="customize-edition-container customize-page">
        <div className="customize-edition">
          {this.renderEditModal()}
          {this.renderSuccessModal()}
          <CustomizeEditionHeader
            lessonNumber={this.props.classroomLesson.data.lesson}
            lessonTitle={this.props.classroomLesson.data.title}
            editionName={this.props.editionMetadata.name}
            sampleQuestion={this.props.editionMetadata.sample_question}
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

function mapStateToProps(state, props) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson,
    incompleteQuestions: getIncompleteQuestions(state),
    originalEditionQuestions: getStoredOriginalEditionQuestions(state),
    editionMetadata: getStoredEditionMetadata(state, props),
    editionQuestions: getStoredEditionQuestions(state),
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(mapStateToProps, dispatch => ({dispatch}), mergeProps)(CustomizeEdition)
