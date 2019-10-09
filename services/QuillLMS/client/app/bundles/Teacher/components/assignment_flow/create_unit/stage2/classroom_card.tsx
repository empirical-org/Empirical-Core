import React from 'react'

import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

export default class ClassroomCard extends React.Component {
  private classroomCard: any

  constructor(props) {

    super(props)

    this.state = {
      isActive: false
    }
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e) => {
    if (this.classroomCard && this.classroomCard.contains(e.target)) {
      this.setState({ isActive: true})
    } else {
      this.setState({ isActive: false})
    }
  }

  selectStudents(studentOptions, classroomId) {
    const studentIds = studentOptions.map(s => s.value)
    this.props.toggleStudentSelection(studentIds, classroomId)
  }

  renderClassroomCheckbox() {
    const { classroom, students, toggleClassroomSelection } = this.props
    const { emptyClassroomSelected, } = classroom

    let checkbox = <span className="quill-checkbox unselected" onClick={() => toggleClassroomSelection(classroom)} />
    const selectedStudents = students && students.length ? students.filter(s => s.isSelected) : []

    if (emptyClassroomSelected || selectedStudents.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(classroom)} >
        <img src={smallWhiteCheckSrc} alt="check" />
      </span>)
    }

    return checkbox
  }

  renderStudentSection() {
    const { isActive, } = this.state
    const { classroom, students, } = this.props
    const { id, emptyClassroomSelected, } = classroom

    const options = students ? students.map((s) => {
      return { value: s.id, label: s.name, isSelected: s.isSelected, }
    }) : []

    const selectedStudents = options.filter(s => s.isSelected)

    if (!selectedStudents.length && !emptyClassroomSelected && !isActive) { return null }

    if (options.length) {
      return (<DropdownInput
        value={selectedStudents}
        isMulti
        options={options}
        optionType="student"
        handleChange={(e) => { this.selectStudents(e, id) }}
      />)
    } else if (emptyClassroomSelected) {
      return <span className="empty-class-students">And all students who join in the future</span>
    }
  }

  render() {
    const { classroom, toggleClassroomSelection, } = this.props
    const { name, } = classroom
    return (<div className="classroom" ref={node => this.classroomCard = node}>
      <div className="checkbox-and-name-container">
        {this.renderClassroomCheckbox()}
        <div className="name-container">
          <span className="name-label">Class</span>
          <span className="name" onClick={() => toggleClassroomSelection(classroom)}>{name}</span>
        </div>
      </div>
      <div className="students-container">
        {this.renderStudentSection()}
      </div>
    </div>)
  }
}
