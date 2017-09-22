import * as React from 'react';
import request from 'request'
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'
import AssignButton from './assignButton'
import AssignedSection from './assignedSection'
import ScriptComponent from '../shared/scriptComponent'
import { getParameterByName } from '../../../libs/getParameterByName';


class ExitSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptionKey: props.followUpActivityName ? "Small Group Instruction and Independent Practice" : '',
      assigned: false
    }
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
    this.assignAction = this.assignAction.bind(this)
    this.redirectAssignedStudents = this.redirectAssignedStudents.bind(this)
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  redirectAssignedStudents(followUpUrl: string){
    const caId: string|null = getParameterByName('classroom_activity_id');
    const selectedOptionKey: string = this.state.selectedOptionKey
    this.props.redirectAssignedStudents(caId, selectedOptionKey, followUpUrl)
  }

  assignAction(e){
    const caId: string|null = getParameterByName('classroom_activity_id');
    const follow_up = this.props.followUpActivityName && this.state.selectedOptionKey !== 'No Follow Up Practice'
    const data = new FormData();
    data.append( "json", JSON.stringify( {follow_up} ) );
    let redirectAssignedStudents=this.redirectAssignedStudents
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${caId}/finish_lesson`, {
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
      if (this.props.followUpActivityName) {
        this.setState({assigned: true})
      } else {
        window.location.href = process.env.EMPIRICAL_BASE_URL
      }
    }).catch((error) => {
      console.log('error', error)
    })
  }

  renderAssignmentOptionsAndButton() {
    const {followUpActivityName, students} = this.props
    if (followUpActivityName && students && Object.keys(students).length > 0 && !this.state.assigned) {
      return <div>
        <AssignmentOptions
          numberOfStudents={students ? Object.keys(students).length : 0}
          updateSelectedOptionKey={this.updateSelectedOptionKey}
          selectedOptionKey={this.state.selectedOptionKey}
          followUpActivityName={followUpActivityName}
        />
        <AssignButton selectedOptionKey={this.state.selectedOptionKey}
                      assignAction={this.assignAction}
        />
      </div>
    } else if (!followUpActivityName) {
      return <div className='assign-button-container'>
        <button onClick={this.assignAction}>End Lesson</button>
      </div>
    }
  }

  renderFlaggedStudents() {
    const {flaggedStudents, students} = this.props
    if (students && Object.keys(students).length > 0)
    return  <FlaggedStudents
              flaggedStudents={flaggedStudents}
              students={students}
              toggleStudentFlag={this.props.toggleStudentFlag}
            />
  }

  renderAssignedSection() {
    if (this.state.assigned) {
      return <AssignedSection selectedOptionKey={this.state.selectedOptionKey} />
    }
  }

  render() {
    return (
      <div className='teacher-exit'>
        <div className="header">
          <h1>
            <span>Slide {this.props.data.current_slide}:</span> {this.props.lessonData.questions[this.props.data.current_slide].data.teach.title}
          </h1>
        </div>
        <ScriptComponent
          script={this.props.script}
          onlyShowHeaders={this.props.onlyShowHeaders}
          updateToggledHeaderCount={this.props.updateToggledHeaderCount}
        />
        {this.renderFlaggedStudents()}
        {this.renderAssignmentOptionsAndButton()}
        {this.renderAssignedSection()}
      </div>
    );
  }

}

export default ExitSlide;
