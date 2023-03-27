import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addScriptItem, deleteEditionSlide, saveEditionSlide, updateSlideScriptItems
} from '../../../actions/classroomLesson';
import { getEditionQuestions } from '../../../actions/customize';
import * as CustomizeIntF from '../../../interfaces/customize';
import * as IntF from '../interfaces';
import {
  getClassroomLesson, getComponent, getComponentDisplayName, scriptItemTypeKeys
} from './helpers';
import Script from './script';

class ShowEditionSlide extends Component<any, any> {
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

    this.props.dispatch(getEditionQuestions(this.props.match.params.editionID))
  }

  classroomLesson(): IntF.ClassroomLesson {
    return getClassroomLesson(this.props.classroomLessons.data, this.props.match.params.classroomLessonID)
  }

  edition(): CustomizeIntF.EditionMetadata {
    return this.props.customize.editions[this.props.match.params.editionID]
  }

  editionQuestions() {
    return this.props.customize.editionQuestions ? this.props.customize.editionQuestions.questions : null;
  }

  currentSlide() {
    return this.editionQuestions() ? this.editionQuestions()[this.props.match.params.slideID] : null
  }

  alertSave() {
    alert('Saved!')
  }

  save(newValues) {
    const {editionID, slideID} = this.props.match.params;
    saveEditionSlide(editionID, slideID, newValues, this.alertSave)
  }

  deleteSlide() {
    const {classroomLessonID, editionID, slideID} = this.props.match.params;
    const slides = this.editionQuestions()
    deleteEditionSlide(editionID, slideID, slides)
    window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/${classroomLessonID}/editions/${editionID}`
  }

  goToNewScriptItem(scriptItemID) {
    window.location.href = `${window.location.origin}/lessons/#/admin/classroom-lessons/${this.props.match.params.classroomLessonID}/editions/${this.props.match.params.editionID}/slide/${this.props.match.params.slideID}/scriptItem/${scriptItemID}`
  }

  addScriptItem() {
    addScriptItem(this.props.match.params.editionID, this.props.match.params.slideID, this.currentSlide(), this.state.newScriptItemType, this.goToNewScriptItem)
  }

  selectNewScriptItemType(e) {
    this.setState({newScriptItemType: e.target.value})
  }

  renderAddScriptItem() {
    if (Object.keys(this.props.customize.editions).length > 0 && this.edition()) {
      const options = scriptItemTypeKeys.map(key => <option key={key} value={key}>{key}</option>)
      return (
        <div className="add-new-slide-form">
          <p className="control has-addons">
            <span className="select is-large">
              <select onChange={this.selectNewScriptItemType} value={this.state.newScriptItem}>
                {options}
              </select>
            </span>
            <a className="button is-primary is-large" onClick={this.addScriptItem}>
              Add Script Item
            </a>
          </p>
        </div>
      )

    }
  }

  updateScriptItemOrder(sortInfo) {
    const newOrder = sortInfo.map(item => item.key);
    const newScriptItems = newOrder.map((key) => this.currentSlide().data.teach.script[key])
    const {editionID, slideID} = this.props.match.params;
    updateSlideScriptItems(editionID, slideID, newScriptItems)
  }

  render() {
    if (Object.keys(this.props.customize.editions).length > 0 && this.edition() && this.editionQuestions() && this.editionQuestions().length > 0) {
      const Component = getComponent(this.currentSlide().type)
      return (
        <div className="admin-classroom-lessons-container">
          <h4 className="title is-4">Edition: <a href={`${window.location.origin}/lessons/#/admin/classroom-lessons/${this.props.match.params.classroomLessonID}/editions/${this.props.match.params.editionID}`}>
            {this.edition().name}
          </a></h4>
          <h5 className="title is-5">Slide: {this.currentSlide().data.teach.title}</h5>
          <h5 className="title is-5">Slide Type: {getComponentDisplayName(this.currentSlide().type)}</h5>
          <button className="button is-primary" onClick={this.deleteSlide}>Delete Slide</button>
          <Component question={this.currentSlide().data} save={this.save} />
          <Script
            editionID={this.props.match.params.editionID}
            lesson={this.props.match.params.classroomLessonID}
            script={this.currentSlide().data.teach.script}
            slide={this.props.match.params.slideID}
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
    classroomLessons: props.classroomLessons,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ShowEditionSlide);
