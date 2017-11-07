import * as React from 'react';
import { connect } from 'react-redux';
import {
  getClassLessonFromFirebase
} from '../../actions/classroomLesson'
import {
  createNewEdition,
  saveEditionName
} from '../../actions/customize'

import EditionNamingModal from './editionNamingModal'

class chooseEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      showNamingModal: false,
      newEditionUid: '',
      newEditionName: ''
    }
    props.dispatch(getClassLessonFromFirebase(props.params.lessonID))

    this.makeNewEdition = this.makeNewEdition.bind(this)
    this.openNamingModal = this.openNamingModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.saveName = this.saveName.bind(this)
  }

  makeNewEdition(editionUid:any) {
    const newEditionUid = createNewEdition(editionUid, this.props.params.lessonID, this.props.customize.user_id)
    this.setState({newEditionUid}, this.openNamingModal)
  }

  openNamingModal() {
    this.setState({showNamingModal: true})
  }

  updateName(e) {
    this.setState({newEditionName: e.target.value})
  }

  saveName() {
    saveEditionName(this.state.newEditionUid, this.state.newEditionName)
  }

  renderNamingModal() {
    if (this.state.showNamingModal) {
      return <EditionNamingModal saveName={this.saveName} updateName={this.updateName} name={this.state.newEditionName}/>
    }
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
      const myEditions = Object.keys(editions).map((e, i) => {
        const edition = editions[e]
        edition.key = e
        return this.renderEditionRow(edition, i, 'user')
      })
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
        <button className="customize" onClick={() => this.makeNewEdition(edition.key)}>
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
      {this.renderNamingModal()}
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
