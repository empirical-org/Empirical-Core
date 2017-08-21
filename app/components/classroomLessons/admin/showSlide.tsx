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

class ShowClassroomLessonSlide extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      newScriptItemType: 'STEP-HTML'
    }

    this.addScriptItem = this.addScriptItem.bind(this)
    this.selectNewScriptItemType = this.selectNewScriptItemType.bind(this)
  }

  classroomLesson(): IntF.ClassroomLesson {
    return getClassroomLesson(this.props.classroomLessons.data, this.props.params.classroomLessonID)
  }

  currentSlide() {
    return this.classroomLesson().questions[this.props.params.slideID]
  }

  addScriptItem() {
    addScriptItem(this.props.params.classroomLessonID, this.props.params.slideID, this.state.newScriptItemType)
  }

  selectNewScriptItemType(e) {
    this.setState({newScriptItemType: e.target.value})
  }

  renderAddScriptItem() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const options = scriptItemTypeKeys.map(key => <option key={key} value={key}>{key}</option>)
      return <div>
        <select value={this.state.newScriptItem} onChange={this.selectNewScriptItemType}>{options}</select>
        <button onClick={this.addScriptItem}>Add ScriptItem</button>
      </div>
    }
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const Component = getComponent(this.currentSlide().type)
      return (
        <div>
          <h4 className="title is-4">
            {this.classroomLesson().title}
          </h4>
          <h5 className="title is-5">
            {this.currentSlide().data.teach.title}
          </h5>
          <p>{getComponentDisplayName(this.currentSlide().type)}</p>
          <Component />
          <Script
            script={this.currentSlide().data.teach.script}
            lesson={this.props.params.classroomLessonID}
            slide={this.props.params.slideID}
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
