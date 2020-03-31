import PropTypes from 'prop-types';
import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default class StudentDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.checkStudents(this.props.students);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
		this.setState(this.checkStudents(nextProps))
	};

  checkStudents = (studentsProps) => {
    let studentProps = studentProps || this.props
    if (!studentProps.students || !studentProps.students.length) {
      return {selectedStudent: {name: 'No Students'}, disabled: true}
    } else {
      return {selectedStudent: studentProps.selectedStudent || studentProps.students[0]}
    }
  };

  students = () => {
		if (!this.state.disabled) {
				return this.props.students.map((student, index) => <MenuItem eventKey={student.id} key={`${student.id}+${index}`}>{student.name}</MenuItem>)
		}
	};

  findStudentById = (id) => {
    return this.props.students.find((c) => c.id === id)
  };

  handleSelect = (studentId) => {
  	//TODO: fix this. this part is redundant (the selectedStudent state is set from higher up),
  	// but this potentially allows this class to be more modular and we are short ontime
  	this.setState({selectedStudent: this.findStudentById(studentId)})
    if (this.props.callback) {
      this.props.callback(studentId)
    }
	};

  render() {
		return (
  <DropdownButton bsStyle='default' disabled={this.state.disabled} id='select-student-dropdown' onSelect={this.handleSelect} title={this.state.selectedStudent.name}>
    {this.students()}
  </DropdownButton>
		);
	}
}
