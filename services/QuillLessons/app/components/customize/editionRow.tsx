import * as React from 'react';
import { connect } from 'react-redux';
const MakeCopy = 'https://assets.quill.org/images/icons/make-copy-edition-icon.svg'
const EditEdition = 'https://assets.quill.org/images/icons/edit-edition-icon.svg'
const DeleteEdition = 'https://assets.quill.org/images/icons/delete-edition-icon.svg'
import * as CustomizeIntf from '../../interfaces/customize'

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
    this.renderCustomizeDropdown = this.renderCustomizeDropdown.bind(this)
    this.makeNewEdition = this.makeNewEdition.bind(this)
    this.editEdition = this.editEdition.bind(this)
    this.archiveEdition = this.archiveEdition.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.hideDropdown = this.hideDropdown.bind(this)
  }

  makeNewEdition() {
    this.props.makeNewEdition(this.props.edition.key)
  }

  editEdition() {
    if (this.props.editEdition) {
      this.props.editEdition(this.props.edition.key)
    }
  }

  archiveEdition() {
    if (window.confirm('Are you sure you want to delete this edition? By deleting the edition, you will lose all the changes that you made to the slides.') && this.props.archiveEdition) {
      this.props.archiveEdition(this.props.edition.key)
    }
  }

  toggleDropdown() {
    this.setState({showDropdown: !this.state.showDropdown})
  }

  hideDropdown() {
    this.setState({showDropdown: false})
  }

  renderCustomizeDropdown() {
    const customizeClass = this.state.showDropdown ? 'open' : ''
    return (<div className="customize-dropdown" onBlur={this.hideDropdown} tabIndex={0}>
      <div className={`customize ${customizeClass}`} onClick={this.toggleDropdown}>
        <i className="fa fa-icon fa-magic" />
        Customize
        <i className="fa fa-icon fa-caret-down" />
      </div>
      <div className="action">
        {this.renderDropdown()}
      </div>
    </div>)
  }

  renderDropdown() {
    const dropdownClass = this.state.showDropdown ? '' : 'hidden'
      let options
      const makeCopy = <div className="option" key="new" onClick={this.makeNewEdition}><img src={MakeCopy} />Make Copy</div>
      if (this.props.creator === 'user') {
        const editEdition = <div className="option" key="edit" onClick={this.editEdition}><img src={EditEdition} />Edit Edition</div>
        const archiveEdition = <div className="option" key="archive" onClick={this.archiveEdition}><img src={DeleteEdition} />Delete Edition</div>
        options = [makeCopy, editEdition, archiveEdition]
      } else {
        options = [makeCopy]
      }
      return (<div className={`dropdown ${dropdownClass}`}>
        {options}
      </div>)
  }

  renderSelectButton() {
    if (this.props.selectState) {
      if (this.props.selectedEdition) {
        return <button className="resume-button" onClick={() => this.props.selectAction(this.props.edition.key)}>Resume</button>
      } else {
        return <button className="select-button" onClick={() => this.props.selectAction(this.props.edition.key)}>Select</button>
      }
    }
  }

  renderCreatedByTag() {
    const teacher = this.props.customize.coteachers.find(t => t.id === this.props.edition.user_id)
    const name = teacher ? teacher.name : null
    if (name) {
      return <span className='locked-unit'>  <i className="fa fa-icon fa-user" />{name}</span>
    }
  }

  render() {
    const name = this.props.edition.name ? this.props.edition.name : 'Generic Content'
    const createdByTag = this.props.creator === 'coteacher' ? this.renderCreatedByTag() : null
    const sampleQuestionSection = this.props.edition.sample_question ? <p className="sample-question"><span>Sample Question: </span>{this.props.edition.sample_question}</p> : null
    const selectedEditionClass = this.props.selectedEdition ? 'selected' : ''
    const selectedEditionTag = this.props.selectedEdition ? <span className="in-progress"><i className="fa fa-icon fa-check" />In Progress</span> : null
    return (<div className="edition-container">
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
    </div>)

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
