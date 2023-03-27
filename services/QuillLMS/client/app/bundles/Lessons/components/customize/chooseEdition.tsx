import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '../../../Shared/index';

import {
    getClassLesson
} from '../../actions/classroomLesson';

import {
    setEditionId, startListeningToSession
} from '../../actions/classroomSessions';
import {
    archiveEdition, createNewEdition, deleteEdition,
    getCurrentUserAndCoteachersFromLMS,
    getEditionMetadataForUserIds, saveEditionName
} from '../../actions/customize';
import * as CustomizeIntF from '../../interfaces/customize';
import { getParameterByName } from '../../libs/getParameterByName';
import {
    ClassroomSessionId,
    ClassroomUnitId
} from '../classroomLessons/interfaces';
import SignupModal from '../classroomLessons/teach/signupModal';
import CreateCustomizedEditionNavbar from '../navbar/createCustomizedEditionNavbar';
import EditionNamingModal from './editionNamingModal';
import EditionRow from './editionRow';

class ChooseEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    const activityUid = props.match.params.lessonID
    const classroomSessionId: ClassroomSessionId|null = classroomUnitId ? classroomUnitId.concat(activityUid) : null

    this.state = {
      showNamingModal: false,
      newEditionUid: '',
      newEditionName: '',
      showSignupModal: false,
      classroomUnitId,
      classroomSessionId
    }

    props.dispatch(getCurrentUserAndCoteachersFromLMS())

    if (activityUid) {
      props.dispatch(getClassLesson(activityUid))
    }

    if (classroomSessionId) {
      props.dispatch(startListeningToSession(classroomSessionId))
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  makeNewEdition(editionUid:string|null) {
    if (this.props.customize.user_id) {
      const newEditionUid = createNewEdition(editionUid, this.props.match.params.lessonID, this.props.customize.user_id)
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
    const classroomUnitId = getParameterByName('classroom_unit_id')
    if (classroomUnitId) {
      route = `/customize/${this.props.match.params.lessonID}/${editionUid}?&classroom_unit_id=${classroomUnitId}`
    } else {
      route = `/customize/${this.props.match.params.lessonID}/${editionUid}`
    }
    return this.props.history.push(route)
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
      const classroomUnitId = getParameterByName('classroom_unit_id')
      if (classroomUnitId) {
        route = `/customize/${this.props.match.params.lessonID}/${this.state.newEditionUid}?&classroom_unit_id=${classroomUnitId}`
      } else {
        route = `/customize/${this.props.match.params.lessonID}/${this.state.newEditionUid}`
      }
      this.props.history.push(route)
    }
  }

  selectAction(editionKey: string) {
    const lessonId = this.props.match.params.lessonID;
    const classroomSessionId:ClassroomSessionId = this.state.classroomSessionId || '';
    const classroomUnitId:ClassroomUnitId = this.state.classroomUnitId || '';

    return setEditionId(classroomSessionId, editionKey, () => window.location.href = `#/teach/class-lessons/${lessonId}?&classroom_unit_id=${classroomUnitId}`)
  }

  renderBackButton() {
    if (window.history.length > 1) {
      return (
        <div className="back-button" onClick={() => window.history.back()}>
          <i className="fa fa-icon fa-chevron-left" />
      Back
        </div>
      )
    }
  }

  renderLessonInfo() {
    const lessonData = this.props.classroomLesson.data;
    const { preview } = this.props.classroomSessions.data;

    let text
    if (preview) {
      text = 'You are previewing this lesson:'
    } else if (getParameterByName('classroom_unit_id')) {
      text = 'You are launching this lesson:'
    } else {
      text = 'You are customizing this lesson:'
    }
    return (
      <div className="lesson-info">
        <p>{text}</p>
        <h2 className="lesson-title"><span>Lesson {lessonData.lesson}:</span> {lessonData.title}</h2>
      </div>
    )
  }

  renderHeader() {
    const selectState = this.props.classroomSessions.data.preview ||
      getParameterByName('classroom_unit_id');

    if (selectState) {
      return <h1>Select Edition of Lesson</h1>
    } else {
      return <h1>Customize Edition of Lesson</h1>
    }
  }

  renderExplanation() {
    return (
      <div className="explanation">
        <p>You can change the prompts in this lesson by clicking <span>"Customize"</span> and selecting <span>"Make Copy."</span> This will create your own edition of the lesson, which you can customize.</p>
        <p>Once you publish your customized edition of the lesson, it will be listed as an option any time you click on the lesson's name.</p>
      </div>
    )
  }

  renderNamingModal() {
    if (this.state.showNamingModal) {
      const buttonClassName = this.state.newEditionName ? 'active' : 'inactive'
      return (
        <EditionNamingModal
          buttonClassName={buttonClassName}
          deleteNewEdition={this.deleteNewEdition}
          saveNameAndGoToCustomize={this.saveNameAndGoToCustomize}
          updateName={this.updateName}
        />
      )
    }
  }

  renderEditions() {
    const selectState = this.props.classroomSessions.data.preview ||
      getParameterByName('classroom_unit_id');
    const { editions, user_id } = this.props.customize
    const sessionEditionId:string|undefined = this.props.classroomSessions.data ? this.props.classroomSessions.data.edition_id : undefined

    if (!Object.keys(editions).length) {
      return <Spinner />
    }

    const quillEditions:Array<JSX.Element>  = []
    const myEditions:Array<JSX.Element> = []
    const coteacherEditions:Array<JSX.Element>  = []
    Object.keys(editions).forEach((e) => {
      const edition:CustomizeIntF.EditionMetadata = editions[e]
      edition.key = e
      if (edition.lesson_id === this.props.match.params.lessonID) {
        if (edition.user_id === user_id) {
          const editionRow = (<EditionRow
            archiveEdition={this.archiveEdition}
            creator='user'
            editEdition={this.editEdition}
            edition={edition}
            key={e}
            makeNewEdition={this.makeNewEdition}
            selectAction={this.selectAction}
            selectedEdition={sessionEditionId === e}
            selectState={selectState}
          />)
          myEditions.push(editionRow)
        } else if (String(edition.user_id) === 'quill-staff') {
          const editionRow = (<EditionRow
            creator='quill'
            edition={edition}
            key={e}
            makeNewEdition={this.makeNewEdition}
            selectAction={this.selectAction}
            selectedEdition={sessionEditionId === e}
            selectState={selectState}
          />)
          quillEditions.push(editionRow)
        } else {
          const editionRow = (<EditionRow
            creator='coteacher'
            edition={edition}
            key={e}
            makeNewEdition={this.makeNewEdition}
            selectAction={this.selectAction}
            selectedEdition={sessionEditionId === e}
            selectState={selectState}
          />)
          coteacherEditions.push(editionRow)
        }
      }
    })
    const compactedQuillEditions = _.compact(quillEditions)
    const compactedMyEditions = _.compact(myEditions)
    const compactedCoteacherEditions = _.compact(coteacherEditions)
    let quillEditionSection, myEditionSection, coteacherEditionSection
    if (compactedQuillEditions.length > 0) {
      quillEditionSection = (<div className="quill-editions">
        <p className="header">Quill Created Editions</p>
        {compactedQuillEditions}
      </div>)
    }
    if (compactedCoteacherEditions.length > 0) {
      coteacherEditionSection = (<div className="coteacher-editions">
        <p className="header">Co-Teacher Customized Editions</p>
        {compactedCoteacherEditions}
      </div>)
    }
    if (compactedMyEditions.length > 0) {
      myEditionSection = (<div className="my-editions">
        <p className="header">My Customized Editions</p>
        {compactedMyEditions}
      </div>)
    }
    return (
      <div>
        {quillEditionSection}
        {myEditionSection}
        {coteacherEditionSection}
      </div>
    )
  }

  renderSignupModal() {
    if (this.state.showSignupModal) {
      return (
        <SignupModal
          closeModal={this.hideSignupModal}
          goToSignup={() => window.location.href = `${import.meta.env.VITE_DEFAULT_URL}/account/new`}
        />
      )
    }
  }

  render() {
    return (
      <div>
        <CreateCustomizedEditionNavbar />
        <div className="choose-edition customize-page">
          {this.renderSignupModal()}
          {this.renderBackButton()}
          {this.renderLessonInfo()}
          {this.renderHeader()}
          {this.renderExplanation()}
          {this.renderEditions()}
          {this.renderNamingModal()}
        </div>
      </div>
    )
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
