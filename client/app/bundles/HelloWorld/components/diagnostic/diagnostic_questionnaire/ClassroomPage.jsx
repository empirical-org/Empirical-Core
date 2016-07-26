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

    // checkboxStateForEachClassroom: function(){
    //     let checkboxes = {};
    //     this.state.classrooms.forEach((classy) =>
    //       checkboxes[classy.id] = false
    //     );
    //     this.state.checkboxes = checkboxes;
    // },

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

    handleSelect: function(grade) {
        this.setState({selectedGrade: grade})
    },

    handleChange: function(index){
      let updatedState = Object.assign({}, this.state)
      updatedState.classrooms[index].checked = !updatedState.classrooms[index].checked
      this.setState({updatedState})
    },

    buildClassRow: function(classy, index) {
      return (<div className='classroom-row' key={classy.id}>
        <div className='pull-left'>
          <input type="checkbox" id={classy.name} className="css-checkbox" value="on" onChange={() => this.handleChange(index)}/>
          <label htmlFor={classy.name} id={classy.name} className="css-label">  <h3>{classy.name}</h3></label>
        </div>
        <div className={'pull-right' + ' is-checked-' + this.state.classrooms[index].checked}>
          <DropdownButton bsStyle='default' title={this.state.selectedGrade || 'st'} id='select-grade' onSelect={this.handleSelect}>
           {this.grades()}
         </DropdownButton>
         <a href='/'>Preview</a>
        </div>
      </div>)
    },


    classroomTable: function(){
      if (this.state.loading) {
        //return loading image
      } else if (this.state.classrooms === [] || null) {
        return <span></span>
      } else {
       let rows = this.state.classrooms.map((classy, index) =>
          this.buildClassRow(classy, index)
      );
      return rows
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
