import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import {
  createNewEdition,
  saveEditionName,
  archiveEdition
} from '../../actions/customize'
import {
  setEditionId
} from '../../actions/classroomSessions'
import EditionNamingModal from './editionNamingModal'
import EditionRow from './editionRow'
import SignupModal from '../classroomLessons/teach/signupModal'
import { getParameterByName } from '../../libs/getParameterByName'

class ChooseEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      showNamingModal: false,
      newEditionUid: '',
      newEditionName: '',
      selectState: getParameterByName('preview') || getParameterByName('classroom_activity_id'),
      showSignupModal: false
    }

    this.makeNewEdition = this.makeNewEdition.bind(this)
    this.editEdition = this.editEdition.bind(this)
    this.archiveEdition = this.archiveEdition.bind(this)
    this.openNamingModal = this.openNamingModal.bind(this)
    this.updateName = this.updateName.bind(this)
    this.saveNameAndGoToCustomize = this.saveNameAndGoToCustomize.bind(this)
    this.selectAction = this.selectAction.bind(this)
    this.hideSignupModal = this.hideSignupModal.bind(this)
  }

  makeNewEdition(editionUid:string|null) {
    if (this.props.customize.user_id) {
      const newEditionUid = createNewEdition(editionUid, this.props.params.lessonID, this.props.customize.user_id)
      this.setState({newEditionUid}, this.openNamingModal)
    } else {
      this.setState({showSignupModal: true})
    }
  }

  hideSignupModal() {
    this.setState({showSignupModal: false})
  }

  editEdition(editionUid:string) {
    let route
    const classroomActivityId = getParameterByName('classroom_activity_id')
    if (classroomActivityId) {
      route = `/customize/${this.props.params.lessonID}/${editionUid}?&classroom_activity_id=${classroomActivityId}`
    } else {
      route = `/customize/${this.props.params.lessonID}/${editionUid}`
    }
    return this.props.router.push(route)
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
    if (this.state.newEditionName) {
      saveEditionName(this.state.newEditionUid, this.state.newEditionName)
      let route
      const classroomActivityId = getParameterByName('classroom_activity_id')
      if (classroomActivityId) {
        route = `/customize/${this.props.params.lessonID}/${this.state.newEditionUid}?&classroom_activity_id=${classroomActivityId}`
      } else {
        route = `/customize/${this.props.params.lessonID}/${this.state.newEditionUid}`
      }
      this.props.router.push(route)
    }
  }

  selectAction(editionKey: string) {
    const lessonId = this.props.params.lessonID
    if (getParameterByName('preview')) {
      const editionId = editionKey ? editionKey : ''
      return this.props.router.push(`teach/class-lessons/${lessonId}/preview/${editionId}`)
    } else if (getParameterByName('classroom_activity_id')) {
      const classroomActivityId = getParameterByName('classroom_activity_id')
      return setEditionId(classroomActivityId, editionKey, () => window.location.href = `#/teach/class-lessons/${lessonId}?&classroom_activity_id=${classroomActivityId}`)
    }
  }

  renderBackButton() {
    if (window.history.length > 1) {
      return <div className="back-button" onClick={() => window.history.back()}>
      <i className="fa fa-icon fa-chevron-left"/>
      Back
      </div>
    }
  }

  renderLessonInfo() {
    const lessonData = this.props.classroomLesson.data
    let text
    if (getParameterByName('preview')) {
      text = 'You are previewing this lesson:'
    } else if (getParameterByName('classroom_activity_id')) {
      text = 'You are launching this lesson:'
    } else {
      text = 'You are customizing this lesson:'
    }
    return <div className="lesson-info">
      <p>{text}</p>
      <h2 className="lesson-title"><span>Lesson {lessonData.lesson}:</span> {lessonData.title}</h2>
    </div>
  }

  renderHeader() {
    if (this.state.selectState) {
      return <h1>Select Edition of Lesson</h1>
    } else {
      return <h1>Customize Edition of Lesson</h1>
    }
  }

  renderExplanation() {
    if (this.state.selectState) {
      return <p className="explanation">By clicking <span>“Customize Edition”</span>, you will be able to make a copy of the edition so that you can customize it with your own content. You can update your own editions at any time by clicking on <span>“Edit Edition”</span>. If you decide to customize a lesson now, your launched lesson will be paused until you publish your new edition.</p>
    } else {
      return <p className="explanation">By clicking <span>"Customize Edition"</span>, you will create a copy of the edition that you can customize it with your own content. You can update your own editions at any time by clicking on <span>"Edit Edition"</span>.</p>
    }
  }

  renderNamingModal() {
    if (this.state.showNamingModal) {
      const buttonClassName = this.state.newEditionName ? 'active' : 'inactive'
      return <EditionNamingModal
              saveNameAndGoToCustomize={this.saveNameAndGoToCustomize}
              updateName={this.updateName}
              buttonClassName={buttonClassName}
              />
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
                selectAction={this.selectAction}
                selectState={this.state.selectState}
              />
    })
    return <div className="quill-editions">
      <p className="header">Quill Created Editions</p>
      {quillEditions}
    </div>
  }

  renderMyEditionsAndCoteacherEditions() {
    const {editions, user_id} = this.props.customize
    if (Object.keys(editions).length > 0) {
      const myEditions = []
      const coteacherEditions = []
      Object.keys(editions).forEach((e) => {
        const edition = editions[e]
        edition.key = e
        if (edition.user_id === user_id && edition.lesson_id === this.props.params.lessonID) {
          const editionRow = <EditionRow
            edition={edition}
            makeNewEdition={this.makeNewEdition}
            editEdition={this.editEdition}
            archiveEdition={this.archiveEdition}
            creator='user'
            key={e}
            selectAction={this.selectAction}
            selectState={this.state.selectState}
          />
          myEditions.push(editionRow)
        } else if (edition.user_id !== user_id && edition.lesson_id === this.props.params.lessonID) {
          const editionRow = <EditionRow
            edition={edition}
            makeNewEdition={this.makeNewEdition}
            creator='coteacher'
            key={e}
            selectAction={this.selectAction}
            selectState={this.state.selectState}
          />
          coteacherEditions.push(editionRow)
        }
      })
      const compactedMyEditions = _.compact(myEditions)
      const compactedCoteacherEditions = _.compact(coteacherEditions)
      let myEditionSection, coteacherEditionSection
      if (compactedCoteacherEditions.length > 0) {
        coteacherEditionSection = <div className="coteacher-editions">
        <p className="header">Co-Teacher Customized Editions</p>
        {compactedCoteacherEditions}
        </div>
      }
      if (compactedMyEditions.length > 0) {
        myEditionSection = <div className="my-editions">
        <p className="header">My Customized Editions</p>
        {compactedMyEditions}
        </div>
      }
      return <div>
        {myEditionSection}
        {coteacherEditionSection}
      </div>
    }
  }

  renderSignupModal() {
    if (this.state.showSignupModal) {
      return <SignupModal
        closeModal={this.hideSignupModal}
        goToSignup={() => window.location.href = `${process.env.EMPIRICAL_BASE_URL}/account/new`}
      />
    }
  }

  render() {
    return <div className="choose-edition customize-page">
      {this.renderSignupModal()}
      {this.renderBackButton()}
      {this.renderLessonInfo()}
      {this.renderHeader()}
      {this.renderExplanation()}
      {this.renderQuillEditions()}
      {this.renderMyEditionsAndCoteacherEditions()}
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

export default connect(select)(ChooseEdition)
