import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import request from 'request';
import Select from 'react-select';
import _ from 'underscore'

export default React.createClass({
  getInitialState: function() {
    return {
      selectedCoteacher: this.props.selected_teacher_id,
      selectedTeachersClassroomIds: this.props.selected_teachers_classrooms,
      firstLoad: true,
      changesToSave: false
    }
  },

  componentDidMount: function(){
    this.handleSelect(this.props.selected_teacher_id)
  },

  classroomsToShow: function(){
    return this.props.classrooms.map((c)=>{
      return {label: c.name, value: c.id}
    })
  },

  markExtantClassrooms: function(teacherClassrooms, invitation, selectedClassrooms){
    this.props.classrooms.forEach((classroom)=>{
      let name = classroom.name
      const matchingClassroom = teacherClassrooms.find((id)=> classroom.id === id)
      if (matchingClassroom) {
        name += invitation ? ' (pending)' : '';
        selectedClassrooms.push({label: name, value: classroom.id})
      }
    })
  },

  matchSelectedClassroomIds: function() {
    const selectedClassrooms = [];
    console.log(this.state.selectedTeachersClassroomIds);
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.invited_to_coteach, true, selectedClassrooms)
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.is_coteacher, false, selectedClassrooms)
    this.setState({selectedClassrooms, originallySelectedClassrooms: selectedClassrooms, firstLoad: false, changesToSave: false, classroomsToShow: this.classroomsToShow()})
  },

  getSelectedTeachersClassroomIds: function(coteacherId){
      const that = this;
      request.get({
        url: `${process.env.DEFAULT_URL}/classrooms_teachers/specific_coteacher_info/${coteacherId}`,
      },
      (e, r, response) => {
        that.setState(JSON.parse(response), that.matchSelectedClassroomIds)
      });
  },

  handleSelect: function(coteacherId) {
    // if it is the first load we already have the information
    if (!this.state.firstLoad) {
      this.getSelectedTeachersClassroomIds(coteacherId)
    } else {
      this.matchSelectedClassroomIds(coteacherId)
    }
  },

  generateMenuItems: function() {
    return this.props.coteachers.map(c => <MenuItem key={c.id} eventKey={c.id}>{c.name}</MenuItem>)
  },

  handleDropdownChange(value) {
    let that = this;
    value.forEach((opt)=>{
      let pending = new RegExp('pending').test(opt.label)
      if (!that.state.originallySelectedClassrooms.find((c)=> c.value === opt.value) && !pending ) {
        opt.label += ' (pending)'
      }
    })
    this.setState({ selectedClassrooms: value, changesToSave: true })
  },

  saveChangesButton: function() {
    const color = this.state.changesToSave
      ? 'green'
      : 'light-gray'
    return <button className={`button-${color}`} disabled={!this.state.changesToSave} onClick={this.saveChanges}>Save Changes</button>
  },

  processClassroomsForSaving() {
    const selectedClassrooms = _.pluck(this.state.selectedClassrooms, 'value')
    const positiveClassrooms = _.difference(selectedClassrooms, this.state.selectedTeachersClassroomIds);
    const negativeClassrooms = _.difference(this.state.selectedTeachersClassroomIds, selectedClassrooms)[0];
    return {negative_classroom_ids: negativeClassrooms, positive_classroom_ids: positiveClassrooms}
  },

  saveChanges: function() {
    const classrooms = this.processClassroomsForSaving()
    request({
      url: `${process.env.DEFAULT_URL}/classrooms_teachers/${this.state.selectedCoteacher}/edit_coteacher_form`,
      method: 'POST',
      json: { classrooms, authenticity_token: ReactOnRails.authenticityToken()},
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
             onValueClick={this.handleDropdownClick}
             onChange={this.handleDropdownChange}
            options={this.state.classroomsToShow}
            value={this.state.selectedClassrooms}/>
        </div>
        {this.saveChangesButton()}
      </div>
    )

  }
});
