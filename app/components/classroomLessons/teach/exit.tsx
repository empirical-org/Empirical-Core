import * as React from 'react';
import {

} from '../interfaces';
import FlaggedStudents from './flaggedStudents.tsx'



class ExitSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='teacher-exit'>
        <FlaggedStudents flaggedStudents={this.props.flaggedStudents} students={this.props.students}/>
      </div>
    );
  }

}

export default ExitSlide;
