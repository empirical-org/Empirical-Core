import React from 'react'
import Student from './student'
import _ from 'underscore'

export default class Classroom extends React.Component {
  state = { open: false }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

 handleClassroomSelection = (e) => {
   const { classroom, toggleClassroomSelection } = this.props
   const { checked, } = e.target
   toggleClassroomSelection(classroom, checked);
 };

 handleToggleClassroomCollapse = () => {
   this.setState(prevState => ({ open: !prevState.open }));
 };

 determineCheckbox = () => {
   const { allSelected, classroom, students } = this.props
   const { id } = classroom
   let allStudentsSelected;
   if (students.length > 0) {
     const selected = _.where(students, {isSelected: true});
     allStudentsSelected = (selected.length == students.length);
   } else {
     allStudentsSelected = allSelected;
   }
   return (
     <input
       aria-labelledby="checkbox-container"
       checked={allStudentsSelected ? 'checked' : null}
       className='css-checkbox classroom_checkbox'
       id={'classroom_checkbox_' + id}
       onChange={this.handleClassroomSelection}
       type='checkbox'
     />
   );
 };

 angleIcon = () => {
   const { open } = this.state
   return open ? 'up' : 'down';
 };

 selectedStudentCount = () => {
   const { students } = this.props
   let selectedStudentCount = 0
   students.forEach((s) => {
     if (s.isSelected) {
       selectedStudentCount += 1;
     }
   })
   return selectedStudentCount
 };

 renderStudentCountText = () => {
   const { allSelected, students } = this.props
   const numberOfStudents = students.length
   const selectedStudentCount = this.selectedStudentCount()
   if (numberOfStudents === 0 && allSelected) {
     return '(Empty class - all added students will be assigned)'
   } else if (selectedStudentCount === 0) {
     return '(0 students will be assigned)'
   } else if (selectedStudentCount === numberOfStudents) {
     return `(All ${numberOfStudents} will be assigned)`
   } else {
     return `(${selectedStudentCount} out of ${numberOfStudents} students will be assigned)`
   }
 };

 // If we have fewer than 4 students in this class, we want to unset our
 // columns style. This is because with the way multicolumn css works, we will
 // otherwise experience some strange formatting we don't want here.
 shouldUnsetColumns = () => {
   const { open, } = this.state
   const { students, } = this.props
   if(!open) {
     return { display: 'none' }
   } else if(students.length < 4) {
     return { columns: 'unset' }
   }
 };

 renderPanel = () => {
   const { classroom, handleStudentCheckboxClick, students, toggleStudentSelection } = this.props
   const { id } = classroom
   const { open, } = this.state

   if (!open) { return }

   const studentList = students.map((student) => (<Student
     classroom={classroom}
     handleStudentCheckboxClick={handleStudentCheckboxClick}
     key={`c${id}s${student.id}`}
     student={student}
     toggleStudentSelection={toggleStudentSelection}
   />)
   )
   return (
     <div className='panel-body student-panel-body' style={this.shouldUnsetColumns()}>
       {studentList}
     </div>
   )
 }

 render() {
   const { classroom } = this.props
   const { id, name } = classroom
   return (
     <div className='panel-group'>
       <div className='panel panel-default'>
         <div className='panel-heading'>
           <h4 className='title'>
             <span>
               Select Entire Class
             </span>
             <button className='toggle-button pull-right select-by-student-button' onClick={this.handleToggleClassroomCollapse} type="button">
               <span className='pull-right panel-select-by-student' >
                 Select by Student <i className={'fas fa-angle-' + this.angleIcon()} />
               </span>
             </button>
             <div id="checkbox-container">
               {this.determineCheckbox()}
               <label className='css-label' htmlFor={'classroom_checkbox_' + id}>
                 {name}
                 <span style={{marginLeft: '5px', fontWeight: '600'}}>
                   {this.renderStudentCountText()}
                 </span>
               </label>
             </div>
           </h4>
         </div>
         {this.renderPanel()}
       </div>
     </div>
   )
 }
}
