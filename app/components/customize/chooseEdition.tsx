import * as React from 'react';
import { connect } from 'react-redux';
import {
  getClassLessonFromFirebase
} from '../../actions/classroomLesson'

class chooseEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)
    props.dispatch(getClassLessonFromFirebase(props.params.lessonID))
  }

  renderQuillEditions() {
    const editions = {lesson: this.props.classroomLesson.data}
    const quillEditions = Object.keys(editions).map((e, i) => this.renderEditionRow(editions[e], i, 'quill'))
    return <div className="quill-editions">
      <p>Quill Created Editions</p>
      {quillEditions}
    </div>
  }

  renderMyEditions() {
    const {editions} = this.props.customize
    if (Object.keys(editions).length > 0) {
      const myEditions = Object.keys(editions).map((e, i) => this.renderEditionRow(editions[e], i, 'user'))
      return <div className="my-editions">
        <p>My Customized Editions</p>
        {myEditions}
      </div>
    }
  }

  renderEditionRow(edition, index, creator) {
    const name = edition.name ? edition.name : 'Generic Content'
    const sampleQuestionSection = edition.sample_question ? <p className="sample-question"><span>Sample Question: </span>{edition.sample_question}</p> : null
    const editLink = creator === 'user' ? <a href="">Edit Edition</a> : null
    return <div className="edition" key={index}>
      <div className="text">
        {name}
        {sampleQuestionSection}
      </div>
      <div className="action">
        {editLink}
        <button className="customize">
          <i className="fa fa-icon fa-magic"/>
          Customize Edition
        </button>
      </div>
    </div>
  }

  render() {
    return <div className="choose-edition">
      <h1>Which edition would you like to customize?</h1>
      <p className="explanation">By clicking <span>"Customize Edition"</span>, you will create a copy of the edition that you can customize it with your own content. You can update your own editions at any time by clicking on <span>"Edit Edition".</span></p>
      {this.renderQuillEditions()}
      {this.renderMyEditions()}
    </div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

export default connect(select)(chooseEdition)
