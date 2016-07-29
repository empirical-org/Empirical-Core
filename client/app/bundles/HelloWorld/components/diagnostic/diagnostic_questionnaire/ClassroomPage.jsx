import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router'
import NumberSuffix from '../../modules/numberSuffixBuilder.js'


export default React.createClass({

    getInitialState: function() {
        return ({loading: true, classrooms: null})
    },

    grades: function() {
        let grades = []
        for (let grade = 1; grade <= 12; grade++) {
            let formattedGrade = NumberSuffix(grade)
            formattedGrade += ' grade reading level'
            grades.push(
                <MenuItem key={formattedGrade} eventKey={grade}>{formattedGrade}</MenuItem>
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

    handleSelect: function(index, grade) {
      let updatedClassrooms = this.state.classrooms.slice(0);
      updatedClassrooms[index].selectedGrade = grade
      this.setState({classrooms: updatedClassrooms})
      console.log(this.state.classrooms[index].selectedGrade)
    },

    handleChange: function(index) {
        let updatedClassrooms = this.state.classrooms.slice(0);
        updatedClassrooms[index].checked = !updatedClassrooms[index].checked
        this.setState({classrooms: updatedClassrooms})
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
                    <DropdownButton bsStyle='default' title={'Select Grade' || this.state.classrooms[index].selectedGrade} id='select-grade' onSelect={this.handleSelect.bind(null, index)}>
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
