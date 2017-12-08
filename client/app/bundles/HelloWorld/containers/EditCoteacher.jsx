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

  matchSelectedClassroomIds: function(coteacherId) {
    const selectedClassrooms = [];
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.invited_to_coteach, true, selectedClassrooms)
    this.markExtantClassrooms(this.state.selectedTeachersClassroomIds.is_coteacher, false, selectedClassrooms)
    this.setState({selectedClassrooms, originallySelectedClassrooms: selectedClassrooms, firstLoad: false, changesToSave: false, classroomsToShow: this.classroomsToShow(), selectedCoteacher: coteacherId})
  },

  getSelectedTeachersClassroomIds: function(coteacherId){
      const that = this;
      request.get({
        url: `${process.env.DEFAULT_URL}/classrooms_teachers/specific_coteacher_info/${coteacherId}`,
      },
      (e, r, response) => {
        that.setState(JSON.parse(response), ()=>that.matchSelectedClassroomIds(coteacherId))
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
      // adds pending to any classroom that the teacher didn't already have a relationship with
      // if pending is already within the object, we use the below regex to not add it twice
      let allreadyPending = new RegExp('pending').test(opt.label)
      if (!that.state.originallySelectedClassrooms.find((c)=> c.value === opt.value) && !allreadyPending ) {
        opt.label += ' (pending)'
      }
    })
    this.setState({ selectedClassrooms: value, changesToSave: true })
  },

  saveChangesButton: function() {
    const color = this.state.changesToSave
      ? 'green'
      : 'light-gray'
    return <button className={`save-changes button-${color}`} disabled={!this.state.changesToSave} onClick={this.saveChanges}>Save Changes</button>
  },

  processClassroomsForSaving() {
    // preexistingRelationships gets all classrooms from current user that this teacher teaches or is invited to do so
    const preexistingRelationships = this.state.selectedTeachersClassroomIds.is_coteacher.concat(this.state.selectedTeachersClassroomIds.invited_to_coteach)
    const selectedClassrooms = _.pluck(this.state.selectedClassrooms, 'value')
    // positive is classrooms to try to invite
    const positiveClassrooms = _.difference(selectedClassrooms, preexistingRelationships);
    // negative is classrooms to remove or withdraw the invitation from
    const negativeClassrooms = _.difference(preexistingRelationships, selectedClassrooms);
    return {negative_classroom_ids: negativeClassrooms, positive_classroom_ids: positiveClassrooms}
  },

  saveChanges: function(shouldRedirect, redirectUrl) {
    const classrooms = this.processClassroomsForSaving()
    request({
      url: `${process.env.DEFAULT_URL}/classrooms_teachers/${this.state.selectedCoteacher}/edit_coteacher_form`,
      method: 'POST',
      json: { classrooms, authenticity_token: ReactOnRails.authenticityToken()},
    },
    (err, httpResponse, body) => {
      if(httpResponse.statusCode !== 200) {
        alert(body.error_message);
      } else {
        if (shouldRedirect && redirectUrl) {
          alert('Teacher Removed!')
          window.location = redirect
        } else {
          alert('Update Successful!')
          this.handleSelect(this.state.selectedCoteacher)
        }
      }
    });
  },

  removeCoteacherConfirmation(){
    const confirmed = window.confirm('This will remove the coteacher from all classroom. You will need to reinvite the teacher before they can regain access.')
    if (confirmed) {
      // removes all classrooms from the teacher by updated selected classrooms, saves the change, and then redirects
      this.setState({selectedClassrooms: []}, ()=> this.saveChanges(true, `${process.env.DEFAULT_URL}/teachers/classrooms`))
    }
  },

  render: function() {
    const selectedTeacherName = this.props.coteachers.find((ct) => ct.id == this.state.selectedCoteacher).name
    return (
      <div id='edit-coteacher'>
        <div className='edit-coteacher-container'>
          <h1>Edit Co-Teachers</h1>
            <label className='select-coteacher'>Select Co-Teacher:</label>
              <DropdownButton bsStyle='default' title={selectedTeacherName} id='select-role-dropdown' onSelect={this.handleSelect}>
                {this.generateMenuItems()}
              </DropdownButton>
        </div>

        <div className='edit-classroom-container'>
          <h2>{selectedTeacherName}</h2>
          <p>The classes that are selected in the dropdown are the current classes that the co-teacher has access to. To invite the co-teacher to more classes, select a new class from the dropdown and click on “Save Changes”. To remove a class, click on the “X” next to the class name and click “Save Changes.”</p>
          <h3>Invite To / Remove From Classes</h3>
          <Select
              name="form-field-name"
             multi={true}
             onValueClick={this.handleDropdownClick}
             onChange={this.handleDropdownChange}
            options={this.state.classroomsToShow}
            value={this.state.selectedClassrooms}/>
        </div>
        {this.saveChangesButton()}
        <span className='remove-coteacher' onClick={this.removeCoteacherConfirmation}>Remove Co-Teacher</span>
      </div>
    )

  }
});
