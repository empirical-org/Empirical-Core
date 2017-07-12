import * as React from 'react';
import {

} from '../interfaces';
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'



class ExitSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptionKey: null
    }
    this.updateSelectedOptionKey = this.updateSelectedOptionKey.bind(this)
  }

  updateSelectedOptionKey(selected) {
    this.setState({selectedOptionKey: selected})
  }

  render() {
    return (
      <div className='teacher-exit'>
        <FlaggedStudents flaggedStudents={this.props.flaggedStudents} students={this.props.students}/>
        <AssignmentOptions numberOfStudents={Object.keys(this.props.students).length} updateSelectedOptionKey={this.updateSelectedOptionKey} selectedOptionKey={this.state.selectedOptionKey} />
      </div>
    );
  }

}

export default ExitSlide;
