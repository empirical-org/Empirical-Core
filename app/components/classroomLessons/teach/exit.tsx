import * as React from 'react';
import {

} from '../interfaces';
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'
import AssignButton from './assignButton'
import ScriptComponent from '../shared/scriptComponent'



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

  assignAction(e){
    // do the thing to the server
    console.log(e)
  }

  render() {
    const {script, flaggedStudents, students} = this.props
    return (
      <div className='teacher-exit'>
        <ScriptComponent
          script={script}
          onlyShowHeaders={this.props.onlyShowHeaders}
          updateToggledHeaderCount={this.props.updateToggledHeaderCount}
        />
        <FlaggedStudents
          flaggedStudents={flaggedStudents}
          students={students}
          toggleStudentFlag={this.props.toggleStudentFlag}
        />
        <AssignmentOptions
          numberOfStudents={Object.keys(students).length}
          updateSelectedOptionKey={this.updateSelectedOptionKey}
          selectedOptionKey={this.state.selectedOptionKey}
        />
        <AssignButton selectedOptionKey={this.state.selectedOptionKey} assignAction={this.assignAction}/>
      </div>
    );
  }

}

export default ExitSlide;
