import * as React from 'react';
import {

} from '../interfaces';
import FlaggedStudents from './flaggedStudents.tsx'


// TODO: build interface for flagged students if it doesn't exist
class FlaggedStudents extends React.Component<{flaggedStudents: Object, students: Object}> {
  constructor(props) {
    super(props);
  }

  listFlaggedStudents(flaggedStudents: Array<string>){
    const studNames = this.props.students
    return flaggedStudents.map((asId)=> {
      return (
        <li key={asId}>
          {studNames[asId]}
        </li>)
      }
    )
  }


  render() {
    const students = Object.keys(this.props.flaggedStudents)
    const studLength = students.length;
    const studSuffix = students.length > 1 ? 's' : ''
    return (
      <div className='flagged-student-list-container'>
        <div className='list-summary'>
          <span>You have flagged <span className="stud-count">{students.length}</span> student{studSuffix}.</span>

        </div>
        <ul>
          {this.listFlaggedStudents(students)}
        </ul>
      </div>
    );
  }

}

export default FlaggedStudents;
