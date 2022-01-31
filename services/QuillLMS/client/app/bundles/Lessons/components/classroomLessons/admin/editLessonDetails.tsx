import React, {Component} from 'react'
import _ from 'lodash'
import {
  addSlide,
  deleteLesson,
  updateEditionSlides
} from '../../../actions/classroomLesson'

export default class EditLessonDetails extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      classroomLesson: this.props.classroomLesson
    }

    this.handleLessonDetailsChange = this.handleLessonDetailsChange.bind(this)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!_.isEqual(nextProps.classroomLesson, this.state.classroomLesson)) {
  //     this.setState({classroomLesson: nextProps.classroomLesson})
  //   }
  // }
  //
  handleLessonDetailsChange(e, key) {
    const newLesson = _.merge({}, this.state.classroomLesson)
    newLesson[key] = e.target.value
    this.setState({classroomLesson: newLesson})
  }

  render() {
    return (
      <div style={{marginTop: 30, marginBottom: 30}}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" onChange={(e) => this.handleLessonDetailsChange(e, 'title')} placeholder="Lesson Title" type="text" value={this.state.classroomLesson.title} />
          </div>
        </div>
        <div className="field">
          <label className="label">Lesson Number</label>
          <div className="control">
            <input className="input" onChange={(e) => this.handleLessonDetailsChange(e, 'lesson')} placeholder="Lesson Order Number" type="text" value={this.state.classroomLesson.lesson} />
          </div>
        </div>
        <div className="field">
          <label className="label">Topic</label>
          <div className="control">
            <input className="input" onChange={(e) => this.handleLessonDetailsChange(e, 'topic')} placeholder="Lesson Topic" type="text" value={this.state.classroomLesson.topic} />
          </div>
        </div>
        <div className="field">
          <label className="label">Unit</label>
          <div className="control">
            <input className="input" onChange={(e) => this.handleLessonDetailsChange(e, 'unit')} placeholder="Unit Name" type="text" value={this.state.classroomLesson.unit} />
          </div>
        </div>
        <div className="control is-grouped" style={{marginTop: 10}}>
          <p className="control">
            <button className="button is-primary" onClick={() => this.props.save(this.state.classroomLesson)}>Save Changes</button>
          </p>
          <p className="control">
            <button className="button is-danger" onClick={this.props.deleteLesson}>Delete Lesson</button>
          </p>
        </div>
      </div>
    )
  }
}
