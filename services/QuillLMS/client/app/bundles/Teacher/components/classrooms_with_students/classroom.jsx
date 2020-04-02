import React from 'react'
import Student from './student'
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import _ from 'underscore'

export default class Classroom extends React.Component {
 constructor(props) {
   super(props)

   this.state = {open: false};
 }

 componentDidMount() {
   window.scrollTo(0, 0);
 }

 handleClassroomSelection = (e) => {
   var checked = e.target.checked;
   this.props.toggleClassroomSelection(this.props.classroom, checked);
 };

 toggleClassroomCollapse = () => {
   this.setState({ open: !this.state.open });
 };

 determineCheckbox = () => {
   var allSelected;
   if (this.props.students.length > 0) {
     var selected = _.where(this.props.students, {isSelected: true});
     allSelected = (selected.length == this.props.students.length);
   } else {
     allSelected = this.props.allSelected;
   }
   return (
     <input
       checked={allSelected ? 'checked' : null}
       className='css-checkbox classroom_checkbox'
       id={'classroom_checkbox_' + this.props.classroom.id}
       onChange={this.handleClassroomSelection}
       type='checkbox'
     />
     );
 };

 angleIcon = () => {
   return this.state.open === true ? 'up' : 'down';
 };

 selectedStudentCount = () => {
   let selectedStudentCount = 0
   this.props.students.forEach((s) => {
     if (s.isSelected) {
       selectedStudentCount += 1;
     }
   })
   return selectedStudentCount
 };

 renderStudentCountText = () => {
   const numberOfStudents = this.props.students.length
   const selectedStudentCount = this.selectedStudentCount()
   if (numberOfStudents === 0 && this.props.allSelected) {
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
   if(this.props.students.length < 4) {
     return { columns: 'unset' }
   }
 };

 renderPanel = () => {
   const { open, } = this.state

   if (!open) { return }

   const studentList = this.props.students.map((student) => (<Student
     classroom={this.props.classroom}
     handleStudentCheckboxClick={this.props.handleStudentCheckboxClick}
     key={`c${this.props.classroom.id}s${student.id}`}
     student={student}
     toggleStudentSelection={this.props.toggleStudentSelection}
   />)
   )

   return (<Panel collapsible expanded={this.state.open} ref='studentList'>
     <div className='panel-body student-panel-body' style={this.shouldUnsetColumns()}>
       {studentList}
     </div>
   </Panel>)
 }

 render() {
   return (
     <div className='panel-group'>
       <div className='panel panel-default'>
         <div className='panel-heading'>
           <h4 className='title'>
             <span>
               Select Entire Class
             </span>
             <Button className='toggle-button pull-right select-by-student-button' onClick={this.toggleClassroomCollapse}>
               <span className='pull-right panel-select-by-student' >
                 Select by Student <i className={'fas fa-angle-' + this.angleIcon()} />
               </span>
             </Button>
             <div>
               {this.determineCheckbox()}
               <label className='css-label' htmlFor={'classroom_checkbox_' + this.props.classroom.id}>
                 {this.props.classroom.name}
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
