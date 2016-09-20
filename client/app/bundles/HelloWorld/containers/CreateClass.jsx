import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NumberSuffix from '../components/modules/numberSuffixBuilder.js'
import LoadingSpinner from '../components/shared/loading_indicator.jsx'
require('../../../assets/styles/app-variables.scss')

export default React.createClass({

    componentDidMount: function() {
        this.getClassCode();
    },

    getInitialState: function() {
        return {
            classroom: {
                name: '',
                grade: null,
                code: null
            },
            loading: true,
            errors: ''
        }
    },

    getClassCode: function() {
        $.ajax({url: '/teachers/classrooms/regenerate_code', success: this.setClassCode})
    },

    setClassCode: function(data) {
        let newClass = Object.assign({}, this.state.classroom)
        newClass.code = data.code
        this.setState({classroom: newClass, loading: false})
    },

    grades: function() {
        let grades = [];
        for (let grade = 1; grade <= 12; grade++) {
            grades.push(
                <MenuItem key={grade} eventKey={grade}>{NumberSuffix(grade)}</MenuItem>
            )
        }
        grades.push(<MenuItem key={'Univeristy'} eventKey={'University'}>University</MenuItem>)
        return grades
    },

    handleChange: function(e) {
        let newClass = Object.assign({}, this.state.classroom)
        newClass.name = e.currentTarget.value
        this.setState({classroom: newClass});
    },

    handleSelect: function(e) {
        let newClass = Object.assign({}, this.state.classroom)
        newClass.grade = e
        this.setState({classroom: newClass});
    },

    onClick: function(){
      this.getClassCode();
    },

    buttonClick: function(){
      const classroom = this.state.classroom
      if (classroom.name && classroom.grade) {
        this.submitClassroom();
      } else {
        const missingValue = classroom.name ? 'name' : 'grade'
        this.setState({errors: 'You must choose your classroom\'s ' + missingValue + ' before continuing.' })
      }
    },

    submitClassroom: function(){
      this.setState({loading: true})
      let that = this;
      $.post('/teachers/classrooms/', {classroom: this.state.classroom})
        .success(function(data){
            let nextPage
            if (that.props.closeModal) {
              // only used if it is rendered within a modal
              that.props.closeModal('because class added');
            }
            else if (data.toInviteStudents) {
              window.location.assign(`/teachers/classrooms/${data.classroom.id}/invite_students`)
            } else {
              window.location.assign('/teachers/classrooms/scorebook')
            }
        })
        .error(function(data){
          that.setState({loading: false})
          const errors = JSON.parse(data.responseText).errors
          const errorMessage = errors.join('\n')
          that.setState({errors: errorMessage})
        })
    },

    render: function() {
        let classroom = this.state.classroom
        function formatTitle(){
          if (classroom.grade) {
            return classroom.grade == 'University' ? classroom.grade : NumberSuffix(classroom.grade)
          } else {
            return 'Grade'
          }
        }
        let contents
          if (this.state.loading) {
            contents = <LoadingSpinner/>
          } else {
            contents =
              <div>
                <h1>Create Your Class</h1>
                <label htmlFor="class-name">*Class Name</label>
                <br/>
                <input type="text" id='class-name' placeholder='e.g. 6th Period ELA' value={classroom.name} onChange={this.handleChange}/>
                <br/>
                <label htmlFor="">*Grade</label>
                <br/>
                <DropdownButton className={classroom.grade ? 'has-grade' : null} bsStyle='default' id='select-grade' title={formatTitle()}   onSelect={this.handleSelect}>
                    {this.grades()}
                </DropdownButton>
                <div>
                  <span>
                    <label htmlFor="classroom_code">Class Code:</label>
                    <input className="inactive class-code text-center" disabled="true" type="text" value={classroom.code} name="classroom[code]" id="classroom_code"/>
                  </span>
                  <span id='regenerate-class-code' onClick={this.onClick}>Regenerate Class Code</span>
                  </div>
                  <button className="button-green" onClick={this.buttonClick}>Create a Class</button>
                  <h4 className='errors'>{this.state.errors}</h4>
            </div>
          }
          return (<div className='container'>
          <div id="new-classroom">
            {contents}
            </div>
          </div>)
    }
});
