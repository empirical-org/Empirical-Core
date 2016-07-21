import React from 'react'

import JoinClassStage1 from '../components/student_profile/students_classrooms/join_class_stage1.jsx'
import JoinClassStage2 from '../components/student_profile/students_classrooms/join_class_stage2.jsx'


export default React.createClass({

  getInitialState: function() {
    return ({stage: 1});
  },

  advanceStage: function() {
    this.setState({stage: 2});
  },

  stateSpecificComponents: function() {
    if (this.state.stage === 1) {
      return <JoinClassStage1 advanceStage={this.advanceStage}/>;
    } else {
      return <JoinClassStage2/>;
    }
  },


  render: function() {
    return (this.stateSpecificComponents());
  }
});
