import * as React from 'react';
import { connect } from 'react-redux';
const MakeCopy = 'https://assets.quill.org/images/icons/make-copy-edition.svg'
const EditEdition = 'https://assets.quill.org/images/icons/edit-edition.svg'
const DeleteEdition = 'https://assets.quill.org/images/icons/delete-edition.svg'

interface EditionRowState {
  showDropdown: boolean
}

interface EditionRowProps {
  archiveEdition: Function,
  classroomLesson: any,
  creator: string,
  customize: any,
  editEdition: Function,
  edition: any,
  makeNewEdition: Function,
  selectAction: Function,
  selectState: string|boolean|null
}

class EditionRow extends React.Component<EditionRowProps, EditionRowState> {
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
    this.props.editEdition(this.props.edition.key)
  }

  archiveEdition() {
    if (window.confirm('Are you sure you want to delete this edition? By deleting the edition, you will lose all the changes that you made to the slides.')) {
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
    return <div className="customize-dropdown" tabIndex={0} onBlur={this.hideDropdown}>
      <div className={`customize ${customizeClass}`} onClick={this.toggleDropdown}>
        <i className="fa fa-icon fa-magic"/>
        Customize
        <i className="fa fa-icon fa-caret-down"/>
      </div>
      <div className="action">
        {this.renderDropdown()}
      </div>
    </div>
  }

  renderDropdown() {
    if (this.state.showDropdown) {
      let options
      const makeCopy = <div key="new" className="option" onClick={this.makeNewEdition}><img src={MakeCopy}/>Make Copy</div>
      if (this.props.creator === 'user') {
        const editEdition = <div key="edit" className="option" onClick={this.editEdition}><img src={EditEdition}/>Edit Edition</div>
        const archiveEdition = <div key="archive" className="option" onClick={this.archiveEdition}><img src={DeleteEdition}/>Delete Edition</div>
        options = [makeCopy, editEdition, archiveEdition]
      } else {
        options = [makeCopy]
      }
      return <div className="dropdown">
        {options}
      </div>
    }
  }

  renderSelectButton() {
    if (this.props.selectState) {
      return <button onClick={() => this.props.selectAction(this.props.edition.key)} className="select-button">Select</button>
    }
  }

  render() {
    const name = this.props.edition.name ? this.props.edition.name : 'Generic Content'
    const sampleQuestionSection = this.props.edition.sample_question ? <p className="sample-question"><span>Sample Question: </span>{this.props.edition.sample_question}</p> : null
    return <div className="edition">
      <div className="text">
        <p className="name">{name}</p>
        {sampleQuestionSection}
      </div>
      <div className="action">
        {this.renderCustomizeDropdown()}
        {this.renderSelectButton()}
      </div>
    </div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

export default connect(select)(EditionRow)
