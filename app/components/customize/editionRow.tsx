import * as React from 'react';
import { connect } from 'react-redux';

class EditionRow extends React.Component<any, any> {
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
  }

  makeNewEdition() {
    this.props.makeNewEdition(this.props.edition.key)
  }

  editEdition() {
    this.props.editEdition(this.props.edition.key)
  }

  archiveEdition() {
    this.props.archiveEdition(this.props.edition.key)
  }

  toggleDropdown() {
    this.setState({showDropdown: !this.state.showDropdown})
  }

  renderCustomizeDropdown() {
    return <div className="customize-dropdown">
      <div className="customize" onClick={this.toggleDropdown}>
        <i className="fa fa-icon fa-magic"/>
        Customize Edition
      </div>
      <div className="action">
        {this.renderDropdown()}
      </div>
    </div>
  }

  renderDropdown() {
    if (this.state.showDropdown) {
      let options
      const makeCopy = <div key="new" className="option" onClick={this.makeNewEdition}>Make Copy</div>
      if (this.props.creator === 'user') {
        const editEdition = <div key="edit" className="option" onClick={this.editEdition}>Edit Edition</div>
        const archiveEdition = <div key="archive" className="option" onClick={this.archiveEdition}>Delete Edition</div>
        options = [makeCopy, editEdition, archiveEdition]
      } else {
        options = [makeCopy]
      }
      return <div className="dropdown">
        {options}
      </div>
    }
  }

  render() {
    const name = this.props.edition.name ? this.props.edition.name : 'Generic Content'
    const sampleQuestionSection = this.props.edition.sample_question ? <p className="sample-question"><span>Sample Question: </span>{this.props.edition.sample_question}</p> : null
    return <div className="edition">
      <div className="text">
        {name}
        {sampleQuestionSection}
      </div>
      <div className="action">
        {this.renderCustomizeDropdown()}
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
