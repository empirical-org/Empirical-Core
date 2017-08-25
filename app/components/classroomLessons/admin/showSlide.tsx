import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  getComponent,
  getClassroomLesson,
  scriptItemTypeKeys
} from './helpers'
import {
  addScriptItem
} from '../../../actions/classroomLesson'
import * as IntF from '../interfaces';
import Script from './script'
import {
  saveClassroomLessonSlide,
  deleteClassroomLessonSlide,
  updateSlideScriptItems
} from 'actions/classroomLesson'

class ShowClassroomLessonSlide extends Component<any, any> {
  constructor(props){
    super(props);

    this.save = this.save.bind(this)

    this.state = {
      newScriptItemType: 'STEP-HTML'
    }

    this.addScriptItem = this.addScriptItem.bind(this)
    this.selectNewScriptItemType = this.selectNewScriptItemType.bind(this)
    this.deleteSlide = this.deleteSlide.bind(this)
    this.updateScriptItemOrder = this.updateScriptItemOrder.bind(this)
    this.goToNewScriptItem = this.goToNewScriptItem.bind(this)
    this.alertSave = this.alertSave.bind(this)
  }

  classroomLesson(): IntF.ClassroomLesson {
    return getClassroomLesson(this.props.classroomLessons.data, this.props.params.classroomLessonID)
  }

  currentSlide() {
    return this.classroomLesson().questions[this.props.params.slideID]
  }

  alertSave() {
    alert('Saved!')
  }

  save(newValues) {
    const {classroomLessonID, slideID} = this.props.params;
    saveClassroomLessonSlide(classroomLessonID, slideID, newValues, this.alertSave)
  }

  deleteSlide() {
    const {classroomLessonID, slideID} = this.props.params;
    const slides = this.classroomLesson().questions
    deleteClassroomLessonSlide(classroomLessonID, slideID, slides)
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}/`
  }

  goToNewScriptItem(scriptItemID) {
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${this.props.params.classroomLessonID}/slide/${this.props.params.slideID}/scriptItem/${scriptItemID}`
  }

  addScriptItem() {
    addScriptItem(this.props.params.classroomLessonID, this.props.params.slideID, this.currentSlide(), this.state.newScriptItemType, this.goToNewScriptItem)
  }

  selectNewScriptItemType(e) {
    this.setState({newScriptItemType: e.target.value})
  }

  renderAddScriptItem() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const options = scriptItemTypeKeys.map(key => <option key={key} value={key}>{key}</option>)
      return (
        <div className="add-new-slide-form">
          <p className="control has-addons">
            <span className="select is-large">
              <select value={this.state.newScriptItem} onChange={this.selectNewScriptItemType}>
                {options}
              </select>
            </span>
            <a className="button is-primary is-large"onClick={this.addScriptItem}>
              Add Script Item
            </a>
          </p>
        </div>
      )

    }
  }

  updateScriptItemOrder(sortInfo) {
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newScriptItems = newOrder.map((key) => this.currentSlide().data.teach.script[key])
    const {classroomLessonID, slideID} = this.props.params;
    updateSlideScriptItems(classroomLessonID, slideID, newScriptItems)
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const Component = getComponent(this.currentSlide().type)
      return (
        <div className="admin-classroom-lessons-container">
          <h4 className="title is-4">Lesson: <a href={`${window.location.origin}/#/admin/classroom-lessons/${this.props.params.classroomLessonID}/`}>
            {this.classroomLesson().title}
          </a></h4>
          <h5 className="title is-5">Slide: {this.currentSlide().data.teach.title}</h5>
          <h5 className="title is-5">Slide Type: {getComponentDisplayName(this.currentSlide().type)}</h5>
          <button className="button is-primary" onClick={this.deleteSlide}>Delete Slide</button>
          <Component question={this.currentSlide().data} save={this.save}/>
          <Script
            script={this.currentSlide().data.teach.script}
            lesson={this.props.params.classroomLessonID}
            slide={this.props.params.slideID}
            updateScriptItemOrder={this.updateScriptItemOrder}
          />
          {this.renderAddScriptItem()}
        </div>
      )
    } else {
      return (<p>Loading...</p>)
    }

  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(ShowClassroomLessonSlide)
