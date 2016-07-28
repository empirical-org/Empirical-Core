import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router'

export default React.createClass({

    getInitialState: function() {
        return ({selectedGrade: '1st grade reading level', loading: true, classrooms: null})
    },

    grades: function() {
        let grades = []
        let formattedGrade;
        for (let grade = 1; grade <= 12; grade++) {
            if (grade === 1) {
                formattedGrade = grade + 'st'
            } else if (grade === 2) {
                formattedGrade = grade + 'nd'
            } else if (grade === 3) {
                formattedGrade = grade + 'rd'
            } else {
                formattedGrade = grade + 'th'
            }
            formattedGrade += ' grade reading level'
            grades.push(
                <MenuItem key={formattedGrade} eventKey={formattedGrade}>{formattedGrade}</MenuItem>
            )
        }
        return grades
    },

    addCheckedProp: function(classrooms) {
        let updatedClassrooms = classrooms.map((classy) => {
            classy.checked = false
            return classy
        })
        return updatedClassrooms
    },

    componentDidMount: function() {
        let that = this;
        $.ajax('/teachers/classrooms/classrooms_i_teach').done(function(data) {
            let classrooms = that.addCheckedProp(data.classrooms);
            that.setState({classrooms: classrooms})
        }).fail(function() {
            alert('error');
        }).always(function() {
            that.setState({loading: false})
        });
    },

    handleSelect: function(grade, index) {
      console.log(this.state)
        let newState = Object.assign({}, this.state);
        newState.classrooms[index].assignedGrade = grade
        this.setState({newState})
    },

    handleChange: function(index) {
        let updatedState = Object.assign({}, this.state)
        updatedState.classrooms[index].checked = !updatedState.classrooms[index].checked
        this.setState({updatedState})
    },

    buildClassRow: function(classy, index) {
        return (
            <div className='classroom-row' key={classy.id}>
                <div className='pull-left'>
                    <input type="checkbox" id={classy.name} className="css-checkbox" value="on" onChange={() => this.handleChange(index)}/>
                    <label htmlFor={classy.name} id={classy.name} className="css-label">
                        <h3>{classy.name}</h3>
                    </label>
                </div>
                <div className={'is-checked-' + this.state.classrooms[index].checked}>
                    <DropdownButton bsStyle='default' title={this.state.selectedGrade || this.state.classrooms[index].assignedGrade} id='select-grade' onSelect={() => this.handleSelect(classy.grade, index)}>
                        {this.grades()}
                    </DropdownButton>
                    <a href='/'>Preview</a>
                </div>
            </div>
        )
    },

    classroomTable: function() {
        if (this.state.loading) {
            //return loading image
        } else if (this.state.classrooms === [] || null) {
            return <span></span>
        } else {
            let rows = this.state.classrooms.map((classy, index) => this.buildClassRow(classy, index));
            return <div id="classroom-table-wrapper">{rows}</div>
        }
    },

    render: function() {
        return (
            <div id='assign-page'>
                <div>
                    <h2>Which classes would you like to assign the diagnostic to?</h2>
                    <span>Which classes would you like to assign the diagnostic to?</span>
                </div>
                {this.classroomTable()}
                <div id="footer-buttons">
                  <div className='pull-right text-center'>
                      <button className='button-green'>Save & Assign</button>
                      <br/>
                      <Link to='/stage/2'>Back</Link>
                    </div>
                </div>


            </div>
        )
    }
});
