import * as React from 'react'

import { DropdownInput, Tooltip } from 'quill-component-library/dist/componentLibrary'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface ClassroomCardProps {
  classroom: any;
  students: Array<any>;
  toggleClassroomSelection: (any) => void;
  toggleStudentSelection: (studentIds, classroomId) => void;
}

interface ClassroomCardState {
  isActive: boolean;
}

export default class ClassroomCard extends React.Component<ClassroomCardProps, ClassroomCardState> {
  private studentSection: any // eslint-disable-line react/sort-comp

  constructor(props) {

    super(props)

    this.state = {
      isActive: false
    }
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e) => {
    if (this.studentSection && this.studentSection.contains(e.target)) {
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
        <img alt="check" src={smallWhiteCheckSrc} />
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
        handleChange={(e) => { this.selectStudents(e, id) }}
        isMulti
        options={options}
        optionType="student"
        value={selectedStudents}
      />)
    } else if (emptyClassroomSelected) {
      return <span className="empty-class-students">And all students who join in the future</span>
    }
  }

  render() {
    const { classroom, toggleClassroomSelection, } = this.props
    return (<div className="classroom">
      <div className="checkbox-and-name-container">
        {this.renderClassroomCheckbox()}
        <div className="name-container">
          <span className="name-label">Class</span>
          <span className="name" onClick={() => toggleClassroomSelection(classroom)}>{classroom.name}</span>
        </div>
      </div>
      <div className="students-container" ref={node => this.studentSection = node}>
        {this.renderStudentSection()}
      </div>
    </div>)
  }
}
