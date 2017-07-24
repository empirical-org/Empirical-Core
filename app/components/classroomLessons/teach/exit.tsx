import * as React from 'react';
import request from 'request'
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'
import AssignButton from './assignButton'
import ScriptComponent from '../shared/scriptComponent'
import { getParameterByName } from '../../../libs/getParameterByName';


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
    const caId: string|null = getParameterByName('classroom_activity_id');
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${caId}/finish_lesson`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      form: {assignAction: e}},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log('error', error)
    })
  }

  render() {
    const {script, flaggedStudents, students} = this.props
    return (
      <div className='teacher-exit'>
        <ScriptComponent
          script={script}
          onlyShowHeaders={this.props.onlyShowHeaders}
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
