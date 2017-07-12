import * as React from 'react';
import {

} from '../interfaces';
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'
import AssignButton from './assignButton'



class ExitSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptionKey: "Small Group Instruction and Independent Practice"
    }
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  assignAction(){
    // do the thing to the server
    console.log('doing something to the server')
  }

  render() {
    return (
      <div className='teacher-exit'>
        <FlaggedStudents
          flaggedStudents={this.props.flaggedStudents}
          students={this.props.students}
          toggleStudentFlag={this.props.toggleStudentFlag}
        />
        <AssignmentOptions
          numberOfStudents={Object.keys(this.props.students).length}
          updateSelectedOptionKey={this.updateSelectedOptionKey}
          selectedOptionKey={this.state.selectedOptionKey}
        />
        <AssignButton selectedOptionKey={this.state.selectedOptionKey} assignAction={this.assignAction}/>
      </div>
    );
  }

}

export default ExitSlide;
