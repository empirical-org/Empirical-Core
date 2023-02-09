import * as React from 'react';

import { DropdownInput, Tooltip, lockedIcon, } from '../../../../../Shared/index';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

interface ClassroomCardProps {
  classroom: any;
  students: Array<any>;
  toggleClassroomSelection: (any) => void;
  toggleStudentSelection: (studentIds, classroomId) => void;
  lockedClassroomIds: Array<string|number>;
  lockedMessage: string;
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

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentDidUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e) => {
    // This was added March 20, 2023 in an attempt to chase down an
    // intermittent bug.  If it's been here for 6+ months, feel free to kill it
    console.log('handleClick()') // eslint-disable-line no-console
    console.log('e.target:') // eslint-disable-line no-console
    console.log(e.target) // eslint-disable-line no-console
    console.log(`this.studentSection.contains(e.target): ${this.studentSection.contains(e.target)}`) // eslint-disable-line no-console

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
    const { classroom, students, toggleClassroomSelection, lockedClassroomIds, lockedMessage, } = this.props
    const { emptyClassroomSelected, } = classroom

    if (lockedClassroomIds.includes(classroom.id)) {
      return <Tooltip tooltipText={lockedMessage} tooltipTriggerText={<img alt={lockedIcon.alt} src={lockedIcon.src} />} />
    }

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
    const { classroom, students, lockedClassroomIds, } = this.props
    const { id, emptyClassroomSelected, } = classroom

    if (lockedClassroomIds.includes(id)) { return null }

    const options = students ? students.map((s) => {
      return { value: s.id, label: s.name, isSelected: s.isSelected, }
    }) : []

    const selectedStudents = options.filter(s => s.isSelected)

    // This was added March 20, 2023 in an attempt to chase down an
    // intermittent bug.  If it's been here for 6+ months, feel free to kill it
    console.log('renderStudentSection()') // eslint-disable-line no-console
    console.log(`selectedStudents.length: ${selectedStudents.length}`) // eslint-disable-line no-console
    console.log(`emptyClassroomSelected: ${emptyClassroomSelected}`) // eslint-disable-line no-console
    console.log(`isActive: ${isActive}`) // eslint-disable-line no-console
    console.log(`options.length: ${options.length}`) // eslint-disable-line no-console

    if (!selectedStudents.length && !emptyClassroomSelected && !isActive) { return null }

    if (options.length) {
      return (
        <DropdownInput
          handleChange={(e) => { this.selectStudents(e, id) }}
          isMulti={true}
          isSearchable={false}
          options={options}
          optionType="student"
          value={selectedStudents}
        />
      )
    } else if (emptyClassroomSelected) {
      return <span className="empty-class-students">And all students who join in the future</span>
    }
  }

  render() {
    const { classroom, toggleClassroomSelection, } = this.props
    return (
      <div className="classroom">
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
      </div>
    )
  }
}
