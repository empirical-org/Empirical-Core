import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from '../../libs/getParameterByName';
import { Question } from '../classroomLessons/interfaces';
import CustomizeNavbar from '../navbar/customizeNavbar';
import CustomizeEditionHeader from './customizeEditionHeader';
import NameAndSampleQuestionModal from './nameAndSampleQuestionModal';
import Slide from './slide';
import SuccessModal from './successModal';

import {
  getClassLesson
} from '../../actions/classroomLesson';

import {
  getCurrentUserAndCoteachersFromLMS,
  getEditionMetadata,
  getEditionMetadataForUserIds,
  getEditionQuestions,
  publishEdition,
  setEditionMetadata,
  setEditionQuestions,
  setIncompleteQuestions,
  setOriginalEditionQuestions,
  setWorkingEditionMetadata,
  setWorkingEditionQuestions
} from '../../actions/customize';

import {
  setEditionId,
  setTeacherModels,
  startListeningToSession
} from '../../actions/classroomSessions';

import {
  getIncompleteQuestions, getStoredEditionMetadata, getStoredEditionQuestions,
  getStoredOriginalEditionQuestions
} from '../../reducers/combined';

import {
  ClassroomSessionId,
  ClassroomUnitId
} from '../classroomLessons/interfaces';


class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    const classroomSessionId = classroomUnitId ? classroomUnitId.concat(activityUid) : null

    this.state = {
      showEditModal: false,
      classroomUnitId,
      classroomSessionId
    };


    props.dispatch(getCurrentUserAndCoteachersFromLMS())

    if (activityUid) {
      props.dispatch(getClassLesson(activityUid))
    }

    if (classroomSessionId) {
      props.dispatch(startListeningToSession(classroomSessionId))
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
    this.afterPublishing = this.afterPublishing.bind(this)
  }

  UNSAFE_componentWillMount() {
    const classroomSessionId: ClassroomSessionId = this.state.classroomSessionId;
    if (classroomSessionId) {
      setEditionId(classroomSessionId, this.props.match.params.editionID);
    }

    this.props.dispatch(getEditionMetadata(
      this.props.match.params.lessonID,
      this.props.match.params.editionID
    ));

    this.props.dispatch(getEditionQuestions(this.props.match.params.editionID));
    this.props.dispatch(setOriginalEditionQuestions(this.props.editionQuestions));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

    if (nextProps.customize.user_id) {
      if (nextProps.customize.user_id !== this.props.customize.user_id || !_.isEqual(nextProps.customize.coteachers, this.props.customize.coteachers)) {
        let user_ids:Array<Number>|never = []
        if (nextProps.customize.coteachers.length > 0) {
          user_ids = nextProps.customize.coteachers.map(c => Number(c.id))
        }
        user_ids.push(nextProps.customize.user_id)
        this.props.dispatch(getEditionMetadataForUserIds(user_ids, this.props.match.params.lessonID))
      }
    } else {
      if (Object.keys(nextProps.customize.editions).length === 0) {
        this.props.dispatch(getEditionMetadataForUserIds([], this.props.match.params.lessonID))
      }
    }
  }

  updateQuestion(question: Question, questionIndex: number) {
    const newEditionQuestions = _.merge({}, this.props.editionQuestions)
    newEditionQuestions.questions[questionIndex].data = question
    this.props.dispatch(setEditionQuestions(newEditionQuestions));
    this.props.dispatch(setWorkingEditionQuestions(newEditionQuestions));
  }

  updateName(e) {
    const { dispatch, editionMetadata, customize, } = this.props
    const newEditionMetadata = _.merge({}, editionMetadata)
    newEditionMetadata.name = e.target.value
    const newEditions = {...customize.editions}
    newEditions[newEditionMetadata.id] = newEditionMetadata
    dispatch(setEditionMetadata(newEditions));
    dispatch(setWorkingEditionMetadata(newEditions));
  }

  updateSampleQuestion(e) {
    const { dispatch, editionMetadata, customize, } = this.props
    const newEditionMetadata = _.merge({}, editionMetadata)
    newEditionMetadata.sample_question = e.target.value
    const newEditions = {...customize.editions}
    newEditions[newEditionMetadata.id] = newEditionMetadata
    dispatch(setEditionMetadata(newEditions));
    dispatch(setWorkingEditionMetadata(newEditions));
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
        for (let i = 0; i < number; i+=1) {
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
        this.props.match.params.editionID,
        this.props.editionMetadata,
        this.props.editionQuestions,
        this.afterPublishing
      ));
    }
  }

  afterPublishing() {
    const classroomSessionId:ClassroomSessionId = this.state.classroomSessionId
    setTeacherModels(classroomSessionId, this.props.match.params.editionID)
    this.goToSuccessPage()
  }

  goToSuccessPage() {
    const classroomUnitId = getParameterByName('classroom_unit_id')
    let link = `/customize/${this.props.match.params.lessonID}/${this.props.match.params.editionID}/success`
    link = classroomUnitId ? link.concat(`?&classroom_unit_id=${classroomUnitId}`) : link
    this.props.history.push(link)
  }

  followUpLink() {
    const {lessonID, editionID} = this.props.match.params
    const classroomUnitId = getParameterByName('classroom_unit_id')
    return classroomUnitId ? `/teach/class-lessons/${lessonID}?&classroom_unit_id=${classroomUnitId}` : `/teach/class-lessons/${lessonID}/preview/${editionID}`
  }

  renderPublishSection() {
    let text
    if (this.props.editionMetadata.name && (!this.props.incompleteQuestions || this.props.incompleteQuestions.length === 0)) {
      text = <p>Press <span>"Publish Edition"</span> to save this lesson. You will see the <span>“Customized”</span> tag next to the name of the lesson.</p>
    } else {
      text = <p className="error"><i className="fa fa-icon fa-exclamation-triangle" />You have left one of the fields above empty. Please fill out all the required fields and click Publish Edition.</p>
    }
    return (
      <div className="publish-container">
        <div className="publish">
          {text}
          <div className="publish-button" onClick={this.publish}>Publish Edition</div>
        </div>
      </div>
    )
  }

  renderSlides() {
    if (this.props.editionQuestions && this.props.editionQuestions.questions) {
      return this.props.editionQuestions.questions.slice(1).map((q, i) => this.renderSlide(q, i))
    }
  }

  renderSlide(q: Question, i: number) {
    const incompletePrompt = this.props.incompleteQuestions && this.props.incompleteQuestions.includes(i)
    return (
      <Slide
        clearSlide={this.clearSlide}
        incompletePrompt={incompletePrompt}
        key={i}
        question={q}
        questionIndex={i+1}
        resetSlide={this.resetSlide}
        updateQuestion={this.updateQuestion}
      />
    )
  }

  renderEditModal() {
    if (this.state.showEditModal) {
      const buttonClassName = this.props.editionMetadata.name ? 'active' : 'inactive'
      return (
        <NameAndSampleQuestionModal
          buttonClassName={buttonClassName}
          closeEditModal={this.closeEditModal}
          name={this.props.editionMetadata.name}
          sampleQuestion={this.props.editionMetadata.sample_question}
          updateName={this.updateName}
          updateSampleQuestion={this.updateSampleQuestion}
        />
      )
    }
  }

  renderSuccessModal() {
    if (window.location.href.indexOf('success') !== -1) {
      const classroomUnitId = getParameterByName('classroom_unit_id')
      const backLink = classroomUnitId
        ? `customize/${this.props.match.params.lessonID}/${this.props.match.params.editionID}?&classroom_unit_id=${classroomUnitId}`
        : `customize/${this.props.match.params.lessonID}/${this.props.match.params.editionID}`
      return (
        <SuccessModal
          activityName={this.props.classroomLesson.data.title}
          backLink={backLink}
          editionLink={this.followUpLink()}
          editionName={this.props.editionMetadata.name}
        />
      )
    }
  }

  render() {
    const { editionMetadata, classroomLesson, } = this.props

    if (!editionMetadata) { return <span /> }

    return (
      <div>
        <CustomizeNavbar />
        <div className="customize-edition-container customize-page">
          <div className="customize-edition">
            {this.renderEditModal()}
            {this.renderSuccessModal()}
            <CustomizeEditionHeader
              editionName={editionMetadata.name}
              lessonNumber={classroomLesson.data.lesson}
              lessonTitle={classroomLesson.data.title}
              sampleQuestion={editionMetadata.sample_question}
              showEditModal={this.showEditModal}
            />
            {this.renderSlides()}
            {this.renderPublishSection()}
          </div>
        </div>
      </div>
    )
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
