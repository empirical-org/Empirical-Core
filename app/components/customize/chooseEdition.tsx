import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash'
import {
  createNewEdition,
  saveEditionName,
  archiveEdition,
  deleteEdition
} from '../../actions/customize'
import {
  setEditionId
} from '../../actions/classroomSessions'
import EditionNamingModal from './editionNamingModal'
import EditionRow from './editionRow'
import SignupModal from '../classroomLessons/teach/signupModal'
import { getParameterByName } from '../../libs/getParameterByName'
import * as CustomizeIntF from 'app/interfaces/customize'

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
    this.deleteNewEdition = this.deleteNewEdition.bind(this)
  }

  componentWillMount() {
    console.log('in choose edtion')
  }

  componentWillUnmount() {
    console.log('about to unmount chooseEdition')
  }

  makeNewEdition(editionUid:string|null) {
    if (this.props.customize.user_id) {
      const newEditionUid = createNewEdition(editionUid, this.props.params.lessonID, this.props.customize.user_id)
      this.setState({newEditionUid}, this.openNamingModal)
    } else {
      this.setState({showSignupModal: true})
    }
  }

  deleteNewEdition() {
    deleteEdition(this.state.newEditionUid)
    this.setState({showNamingModal: false})
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
    const classroomActivityId = getParameterByName('classroom_activity_id')
    if (getParameterByName('preview')) {
      const editionId = editionKey ? editionKey : ''
      return this.props.router.push(`teach/class-lessons/${lessonId}/preview/${editionId}`)
    } else if (classroomActivityId) {
      console.log('wtf')
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
      return <p className="explanation">By clicking <span>“Customize”</span> and then selecting <span>“Make Copy,”</span> you will be able to customize the lesson with your own content. You can update your own editions at any time by clicking on <span>“Customize”</span> and then selecting <span>“Edit Edition”</span>. If you decide to customize a lesson now, your launched lesson will be paused until you publish your new edition.</p>
    } else {
      return <p className="explanation">By clicking <span>“Customize”</span> and then selecting <span>“Make Copy,”</span> you will be able to customize the lesson with your own content. You can update your own editions at any time by clicking on <span>“Customize”</span> and then selecting <span>“Edit Edition”</span>.</p>
    }
  }

  renderNamingModal() {
    if (this.state.showNamingModal) {
      const buttonClassName = this.state.newEditionName ? 'active' : 'inactive'
      return <EditionNamingModal
              saveNameAndGoToCustomize={this.saveNameAndGoToCustomize}
              updateName={this.updateName}
              buttonClassName={buttonClassName}
              deleteNewEdition={this.deleteNewEdition}
              />
    }
  }

  renderEditions() {
    const {editions, user_id} = this.props.customize
    const sessionEditionId:string|undefined = this.props.classroomSessions.data ? this.props.classroomSessions.data.edition_id : undefined
    if (Object.keys(editions).length > 0) {
      const quillEditions:Array<JSX.Element>  = []
      const myEditions:Array<JSX.Element> = []
      const coteacherEditions:Array<JSX.Element>  = []
      Object.keys(editions).forEach((e) => {
        const edition:CustomizeIntF.EditionMetadata = editions[e]
        edition.key = e
        if (edition.lesson_id === this.props.params.lessonID) {
          if (edition.user_id === user_id) {
            const editionRow = <EditionRow
              key={e}
              edition={edition}
              makeNewEdition={this.makeNewEdition}
              editEdition={this.editEdition}
              archiveEdition={this.archiveEdition}
              creator='user'
              selectAction={this.selectAction}
              selectState={this.state.selectState}
              selectedEdition={sessionEditionId === e}
              />
            myEditions.push(editionRow)
          } else if (String(edition.user_id) === 'quill-staff') {
            const editionRow = <EditionRow
              key={e}
              edition={edition}
              makeNewEdition={this.makeNewEdition}
              creator='quill'
              selectAction={this.selectAction}
              selectState={this.state.selectState}
              selectedEdition={sessionEditionId === e}
            />
            quillEditions.push(editionRow)
          } else {
            const editionRow = <EditionRow
              key={e}
              edition={edition}
              makeNewEdition={this.makeNewEdition}
              creator='coteacher'
              selectAction={this.selectAction}
              selectState={this.state.selectState}
              selectedEdition={sessionEditionId === e}
            />
            coteacherEditions.push(editionRow)
          }
        }
      })
      const compactedQuillEditions = _.compact(quillEditions)
      const compactedMyEditions = _.compact(myEditions)
      const compactedCoteacherEditions = _.compact(coteacherEditions)
      let quillEditionSection, myEditionSection, coteacherEditionSection
      if (compactedQuillEditions.length > 0) {
        quillEditionSection = <div className="quill-editions">
        <p className="header">Quill Created Editions</p>
        {compactedQuillEditions}
        </div>
      }
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
        {quillEditionSection}
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
      {this.renderEditions()}
      {this.renderNamingModal()}
    </div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson,
    classroomSessions: state.classroomSessions
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ChooseEdition)
