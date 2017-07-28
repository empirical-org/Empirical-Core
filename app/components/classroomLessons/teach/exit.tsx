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
      selectedOptionKey: "Small Group Instruction and Independent Practice",
    }
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
    this.assignAction = this.assignAction.bind(this)
    this.getAssignedStudents = this.getAssignedStudents.bind(this)
    this.redirectAssignedStudents = this.redirectAssignedStudents.bind(this)
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  getAssignedStudents(){
    const studs = Object.keys(this.props.students);
    switch(this.state.selectedOptionKey) {
    case "Small Group Instruction and Independent Practice":
        const fs = this.props.flaggedStudents ? Object.keys(this.props.flaggedStudents) : null
        if (fs && fs.length) {
          return studs.filter(stud => !fs.includes(stud));
        }
        return studs
    case 'All Students Practice Now':
        return studs
    default:
      return [];
    }
  }

  redirectAssignedStudents(followUpUrl: string){
    const assignedStudents = this.getAssignedStudents()
    const caId: string|null = getParameterByName('classroom_activity_id');
    this.props.redirectAssignedStudents(caId, assignedStudents, followUpUrl)
  }

  assignAction(e){
    const caId: string|null = getParameterByName('classroom_activity_id');
    const follow_up = this.state.selectedOptionKey !== 'No Follow Up Practice'
    const data = new FormData();
    data.append( "json", JSON.stringify( {follow_up} ) );
    let redirectAssignedStudents=this.redirectAssignedStudents
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${'1299436'}/finish_lesson`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: data
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      redirectAssignedStudents(response.follow_up_url)
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
        <AssignButton selectedOptionKey={this.state.selectedOptionKey}
                      assignAction={this.assignAction}
        />
      </div>
    );
  }

}

export default ExitSlide;
