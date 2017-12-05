import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import request from 'request';

export default React.createClass({
  getInitialState: function() {
    return {
      selectedCoteacher: null,
      checkboxClassrooms: this.props.classrooms,
    }
  },

  componentDidMount: function(){
    this.handleSelect(this.props.selected_teacher_id)
  },

  handleSelect: function(coteacherId) {
    const classroomsBelongingToSpecificTeacher = this.props.classroomsGroupedByCoteacherId[coteacherId]
    const checkboxClassrooms = this.state.checkboxClassrooms
    classroomsBelongingToSpecificTeacher.forEach((classroomId) => {
      let matchingClassroom = checkboxClassrooms.find(classy => classy.id === classroomId )
      if (matchingClassroom) {
        matchingClassroom.checked = true
      } else {
        matchingClassroom.checked = false
      }
    })
    this.setState({
      selectedCoteacher: this.props.coteachers.find(ct => ct.id == coteacherId),
      checkboxClassrooms,
      changesToSave: false
    });
  },

  generateMenuItems: function() {
    return this.props.coteachers.map(c=> <MenuItem key={c.id} eventKey={c.id}>{c.name}</MenuItem>)
  },

  toggleCheckbox: function(e) {
    const newCheckboxClassrooms = [...this.state.checkboxClassrooms]
    const matchingClassroom = newCheckboxClassrooms.find((c)=>c.id == e);
    matchingClassroom.checked = !matchingClassroom.checked;
    this.setState({checkboxClassrooms: newCheckboxClassrooms, changesToSave: true})
  },

  showClassSelection: function() {
    const selectedCoteacher = this.state.selectedCoteacher;
    if(selectedCoteacher) {
      return(
        <div key={this.state.selectedCoteacher}>
          <hr />
          <h2>{selectedCoteacher.name}</h2>
          <strong>Select/Unselect Classes:</strong>
            {this.state.checkboxClassrooms.map(c => {
              return(
                <div>
                  <div key={c.id + c.checked} className="donalito-checkbox" onClick={()=>this.toggleCheckbox(c.id)}>
                    {c.checked ? <img className="recommendation-check" src="/images/recommendation_check.svg"></img> : null}
                  </div>
                  {c.name}
                </div>
              )
            })}
        </div>
      );
    }
  },

  saveChangesButton: function() {
    const color = this.state.changesToSave ? 'green' : 'light-gray'
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
    return (
      <div>
        <h1>Edit Co-Teachers</h1>
         <label>Select Co-Teacher:</label>
         <DropdownButton bsStyle='default' title={this.state.selectedCoteacher ? this.state.selectedCoteacher.name : 'Select Co-Teacher'} id='select-role-dropdown' onSelect={this.handleSelect}>
           {this.generateMenuItems()}
         </DropdownButton>
        {this.showClassSelection()}
        {this.saveChangesButton()}
      </div>
    )
   }
 });
