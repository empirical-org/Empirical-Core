import * as React from 'react';
import { connect } from 'react-redux';
import {
  getClassLessonFromFirebase
} from '../../actions/classroomLesson'
import {
  createNewEdition,
  saveEditionName,
  archiveEdition
} from '../../actions/customize'

import EditionNamingModal from './editionNamingModal'
import EditionRow from './editionRow'

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
    this.editEdition = this.editEdition.bind(this)
    this.archiveEdition = this.archiveEdition.bind(this)
    this.openNamingModal = this.openNamingModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.saveNameAndGoToCustomize = this.saveNameAndGoToCustomize.bind(this)
  }

  makeNewEdition(editionUid:string|null) {
    const newEditionUid = createNewEdition(editionUid, this.props.params.lessonID, this.props.customize.user_id)
    this.setState({newEditionUid}, this.openNamingModal)
  }

  editEdition(editionUid:string) {
    window.location.href = `${window.location.origin}/#/customize/${this.props.params.lessonID}/${this.state.editionUid}`
  }

  archiveEdition(editionUid:string) {
    archiveEdition(editionUid)
  }

  openNamingModal() {
    this.setState({showNamingModal: true})
  }

  updateName(e) {
    this.setState({newEditionName: e.target.value})
  }

  saveNameAndGoToCustomize() {
    saveEditionName(this.state.newEditionUid, this.state.newEditionName)
    window.location.href = `${window.location.origin}/#/customize/${this.props.params.lessonID}/${this.state.newEditionUid}`
  }

  renderNamingModal() {
    if (this.state.showNamingModal) {
      return <EditionNamingModal saveNameAndGoToCustomize={this.saveNameAndGoToCustomize} updateName={this.updateName} name={this.state.newEditionName}/>
    }
  }

  renderQuillEditions() {
    const editions = {lesson: this.props.classroomLesson.data}
    const quillEditions = Object.keys(editions).map((e, i) => {
      return <EditionRow
                edition={editions[e]}
                makeNewEdition={this.makeNewEdition}
                editEdition={this.editEdition}
                archiveEdition={this.archiveEdition}
                creator='quill'
                key={i}
      />
    })
    return <div className="quill-editions">
      <p>Quill Created Editions</p>
      {quillEditions}
    </div>
  }

  renderMyEditions() {
    const {editions} = this.props.customize
    if (Object.keys(editions).length > 0) {
      const myEditions = Object.keys(editions).map((e) => {
        const edition = editions[e]
        edition.key = e
        return <EditionRow
                  edition={edition}
                  makeNewEdition={this.makeNewEdition}
                  editEdition={this.editEdition}
                  archiveEdition={this.archiveEdition}
                  creator='user'
                  key={e}
        />
      })
      return <div className="my-editions">
        <p>My Customized Editions</p>
        {myEditions}
      </div>
    }
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
