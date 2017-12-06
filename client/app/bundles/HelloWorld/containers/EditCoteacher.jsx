import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import request from 'request';
import Select from 'react-select';

export default React.createClass({
  getInitialState: function() {
    return {selectedCoteacher: this.props.selected_teacher_id, selectedTeachersClassroomIds: this.props.selected_teachers_classrooms}
  },
  //
  componentDidMount: function(){
    // debugger;
    this.handleSelect(this.props.selected_teacher_id)
  },

  markExtantClassrooms: function(teacherClassrooms, invitation, classroomsToShow, selectedClassrooms){
    this.props.classrooms.forEach((classroom)=>{
      let name = classroom.name
      const matchingClassroom = teacherClassrooms.find((id)=> classroom.id === id)
      if (matchingClassroom) {
        name += invitation ? ' (pending)' : '';
        selectedClassrooms.push({label: name, value: classroom.id})
      }
      classroomsToShow.push({label: classroom.name, value: classroom.id})
    })
    debugger;
    console.log('hi');
  },

  matchSelectedClassroomIds: function() {
    const classroomsToShow = [];
    const selectedClassrooms = [];
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.invited_to_coteach, true, classroomsToShow, selectedClassrooms)
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.is_coteacher, false, classroomsToShow, selectedClassrooms)
    this.setState({classroomsToShow, selectedClassrooms})
  },

  handleSelect: function(coteacherId) {
    if (!this.state.selectedCoteacher != coteacherId) {
      // this.getSelectedTeachersClassroomIds(coteacherId)
    }
    this.matchSelectedClassroomIds(coteacherId)
  },

  generateMenuItems: function() {
    return this.props.coteachers.map(c => <MenuItem key={c.id} eventKey={c.id}>{c.name}</MenuItem>)
  },
  //
  // handleDropdownChange(value) {
  //   this.setState({ selectedClassrooms: value })
  // }
  //
  saveChangesButton: function() {
    const color = this.state.changesToSave
      ? 'green'
      : 'light-gray'
    return <button className={`button-${color}`} disabled={!this.state.changesToSave} onClick={this.saveChanges}>Save Changes</button>
  },

  saveChanges: function() {

    request({
      url: `${process.env.DEFAULT_URL}/classrooms_teachers/${this.state.selectedCoteacher.id}/edit_coteacher_form`,
      method: 'POST',
      json: { classrooms: this.state.checkboxClassrooms, authenticity_token: ReactOnRails.authenticityToken(), },
    },
    (err, httpResponse, body) => {
      if(httpResponse.statusCode !== 200) {
        alert(body.error_message);
      }
    });
  },

  render: function() {
    const dropdownTitle = this.props.coteachers.find((ct) => ct.id == this.state.selectedCoteacher).name
    return (
      <div>
        <h1>Edit Co-Teachers</h1>
        <label>Select Co-Teacher:</label>
        <DropdownButton bsStyle='default' title={dropdownTitle} id='select-role-dropdown' onSelect={this.handleSelect}>
          {this.generateMenuItems()}
        </DropdownButton>
        <div>
          <div>Select Classes</div>
          <Select name="form-field-name"
             multi={true}
             onChange={this.handleDropdownChange}
            options={this.state.classroomsToShow}
            value={this.state.selectedClassrooms}/>
        </div>
        {this.saveChangesButton()}
      </div>
    )

  }
});
