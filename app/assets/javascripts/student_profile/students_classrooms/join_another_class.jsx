$(function () {
  var ele = $('#add-additional-class')[0]
  if (ele) {
    React.render(React.createElement(EC.JoinAnotherClass), ele)
  }
});


'use strict'
EC.JoinAnotherClass = React.createClass({


  getInitialState: function() {
    return ({stage: 1});
  },

  componentDidMount: function() {
    // $.ajax({url: 'students_classrooms', format: 'json', success: this.updateClassrooms})
  },

  stage1: function() {

  },

  stateSpecificComponents: function() {
    if (this.state.stage === 1) {
      return <h1>Join a New Class</h1>
    } else {
      return <h1>Class Joined</h1>
    }
  },


  render: function() {
    return (this.stateSpecificComponents());
  }




})
