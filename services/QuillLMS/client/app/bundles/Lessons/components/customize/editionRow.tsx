import * as React from 'react';
import { connect } from 'react-redux';
const MakeCopy = 'https://assets.quill.org/images/icons/make-copy-edition-icon.svg'
const EditEdition = 'https://assets.quill.org/images/icons/edit-edition-icon.svg'
const DeleteEdition = 'https://assets.quill.org/images/icons/delete-edition-icon.svg'

import * as CustomizeIntf from '../../interfaces/customize'
import { MOUSEDOWN } from '../../../Shared/utils/eventNames'

interface EditionRowState {
  showDropdown: boolean
}

interface EditionRowProps {
  edition: CustomizeIntf.EditionMetadata
  archiveEdition?: Function
  creator: string
  editEdition?: Function
  makeNewEdition: Function
  selectAction: Function
  selectState: string|boolean|null
  selectedEdition: boolean
}

export interface AppProps extends EditionRowProps, DispatchFromProps, StateFromProps{

}
class EditionRow extends React.Component<AppProps, EditionRowState> {
  constructor(props) {
    super(props)

    this.state = {
      showDropdown: false
    }
  }

  componentDidMount() {
    document.addEventListener(MOUSEDOWN, this.handleDropdownBlur, true)
  }

  componentWillUnmount() {
    document.removeEventListener(MOUSEDOWN, this.handleDropdownBlur, true)
  }


  handleClickMakeNewEdition = () => {
    const { makeNewEdition, edition, } = this.props

    makeNewEdition(edition.key)
  }

  handleClickEditEdition = () => {
    const { editEdition, edition, } = this.props

    if (editEdition) {
      editEdition(edition.key)
    }
  }

  handleClickArchiveEdition = () => {
    const { archiveEdition, edition, } = this.props

    if (window.confirm('Are you sure you want to delete this edition? By deleting the edition, you will lose all the changes that you made to the slides.') && archiveEdition) {
      archiveEdition(edition.key)
    }
  }

  handleDropdownClick = () => {
    this.setState(prevState => ({showDropdown: !prevState.showDropdown}))
  }

  handleDropdownBlur = (e) => {
    if (!this.node || !this.node.contains(e.target)) {
      this.setState({showDropdown: false})
    }
  }

  handleSelectAction = () => {
    const { selectAction, edition, } = this.props

    selectAction(edition.key)
  }

  renderCustomizeDropdown = () => {
    const { showDropdown, } = this.state
    const customizeClass = showDropdown ? 'open' : ''
    return (
      <div className="customize-dropdown" ref={node => this.node = node}>
        <button className={`interactive-wrapper customize ${customizeClass}`} onClick={this.handleDropdownClick} type="button">
          <i className="fa fa-icon fa-magic" />
            Customize
          <i className="fa fa-icon fa-caret-down" />
        </button>
        <div className="action">
          {this.renderDropdown()}
        </div>
      </div>
    )
  }

  renderDropdown() {
    const { showDropdown, } = this.state
    const { creator, } = this.props

    const dropdownClass = showDropdown ? '' : 'hidden'
    const makeCopy = <button className="interactive-wrapper option" key="new" onClick={this.handleClickMakeNewEdition} type="button"><img alt="" src={MakeCopy} />Make Copy</button>

    let options = [makeCopy]
    if (creator === 'user') {
      const editEdition = <button className="interactive-wrapper option" key="edit" onClick={this.handleClickEditEdition} type="button"><img alt="" src={EditEdition} />Edit Edition</button>
      const archiveEdition = <button className="interactive-wrapper option" key="archive" onClick={this.handleClickArchiveEdition} type="button"><img alt="" src={DeleteEdition} />Delete Edition</button>
      options = [makeCopy, editEdition, archiveEdition]
    }

    return (
      <div className={`dropdown ${dropdownClass}`}>
        {options}
      </div>
    )
  }

  renderSelectButton() {
    const { selectState, selectedEdition, } = this.props

    if (selectState) {
      if (selectedEdition) {
        return <button className="resume-button" onClick={this.handleSelectAction} type="button">Resume</button>
      } else {
        return <button className="select-button" onClick={this.handleSelectAction} type="button">Select</button>
      }
    }
  }

  renderCreatedByTag() {
    const { customize, edition, } = this.props

    const teacher = customize.coteachers.find(t => t.id === edition.user_id)
    const name = teacher ? teacher.name : null
    if (name) {
      return <span className='locked-unit'>  <i className="fa fa-icon fa-user" />{name}</span>
    }
  }

  render() {
    const { edition, selectedEdition, creator, } = this.props

    const name = edition.name ? edition.name : 'Generic Content'
    const createdByTag = creator === 'coteacher' ? this.renderCreatedByTag() : null
    const sampleQuestionSection = edition.sample_question ? <p className="sample-question"><span>Sample Question: </span>{edition.sample_question}</p> : null
    const selectedEditionClass = selectedEdition ? 'selected' : ''
    const selectedEditionTag = selectedEdition ? <span className="in-progress"><i className="fa fa-icon fa-check" />In Progress</span> : null
    return (
      <div className="edition-container">
        <div className={`edition ${selectedEditionClass}`}>
          <div className="text">
            <div className="name-section"><p className="name">{name}</p>{createdByTag}</div>
            {sampleQuestionSection}
          </div>
          <div className="action">
            {this.renderCustomizeDropdown()}
            {this.renderSelectButton()}
          </div>
        </div>
        {selectedEditionTag}
      </div>
    )

  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {

}

export interface StateFromProps {
  customize: any
  classroomLesson: any
}

export default connect<StateFromProps, DispatchFromProps, EditionRowProps>(select)(EditionRow)
