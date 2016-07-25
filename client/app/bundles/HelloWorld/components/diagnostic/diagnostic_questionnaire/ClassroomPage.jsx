import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import Checkbox from 'react-bootstrap/lib/Checkbox'

export default React.createClass({

    getInitialState: function() {
        return ({
                selectedGrade: '1st',
                loading: true,
                classrooms: null
              })
    },

    componentDidMount: function() {
      let that = this;
        $.ajax('/teachers/classrooms/classrooms_i_teach').done(function(data) {
          that.setState({classrooms: data.classrooms})
        }).fail(function() {
            alert('error');
        }).always(function() {
            that.setState({loading: false})
        });
    },

    handleSelect: function(grade) {
        this.setState({selectedGrade: grade})
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
            grades.push(
                <MenuItem key={formattedGrade} eventKey={formattedGrade}>{formattedGrade}</MenuItem>
            )
        }
        return grades
    },

    buildClassRow: function(classy) {
      return (<div className='classroom-row' key={classy.id}>
        <div className='pull-left'>
          <input type="checkbox" id={classy.name} className="css-checkbox" value="on"/>
          <label htmlFor={classy.name} id={classy.name} className="css-label">  <h3>{classy.name}</h3></label>
        </div>
        <div className='pull-right'>

        </div>
      </div>)
    },


    classroomTable: function(){
      if (this.state.loading) {
        //return loading image
      } else if (this.state.classrooms === [] || null) {
        return <span></span>
      } else {
        return this.state.classrooms.map((classy) =>
          this.buildClassRow(classy)
      );
      }
    },

    render: function() {
        return (
            <div id='assign-page'>
                <div>
                    <h2>Which classes would you like to assign the diagnostic to?</h2>
                    {/*<DropdownButton bsStyle='default' title={this.state.selectedGrade || 'st'} id='select-grade' onSelect={this.handleSelect}>
                        {this.grades()}
                      </DropdownButton>*/}
                    <span>Which classes would you like to assign the diagnostic to?</span>
                </div>
                {this.classroomTable()}
                <button className='button-green'>Preview the diagnostic</button>
                <br/>
                <button className='button-green'>Continue to Assign</button>
            </div>
        )
    }
});
