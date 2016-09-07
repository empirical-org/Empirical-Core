import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { Router, Route, Link, hashHistory } from 'react-router'


export default React.createClass({

  getInitialState: function(){
    return ({selectedGrade: '1st'})
  },

  handleSelect: function(grade){
    this.setState({selectedGrade: grade})
  },

  grades: function(){
    let grades = []
    let formattedGrade;
    for(let grade = 1; grade <= 12; grade++){
      if (grade === 1) {
        formattedGrade = grade + 'st'
      } else if (grade === 2) {
        formattedGrade = grade + 'nd'
      } else if (grade === 3) {
        formattedGrade = grade + 'rd'
      } else {
        formattedGrade = grade + 'th'
      }
      grades.push(<MenuItem key={formattedGrade} eventKey={formattedGrade}>{formattedGrade}</MenuItem>)
    }
    return grades
  },


    render: function() {
        return (
            <div id='intro-page'>
                <div>
                    <h2>Would you like to preview the sentence structure diagnostic?</h2>
                      {/*<span>
                      <DropdownButton bsStyle='default' title={this.state.selectedGrade || 'st'} id='select-grade' onSelect={this.handleSelect}>
                        {this.grades()}
                      </DropdownButton>
                        </span>grade */}
                      <span id='subtext'>You'll be previewing the diagnostic as a student and will be able to assign at any time.</span>
                </div>
                <button id='preview' className='button-green'>Preview the Diagnostic</button>
                <br/>
                <Link id='assign' to='/stage/3'><button className='button-green'>Continue to Assign</button></Link>
            </div>
        )
    }
});
