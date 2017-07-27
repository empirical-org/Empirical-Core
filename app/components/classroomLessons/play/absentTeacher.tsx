declare function require(name:string);
import * as React from 'react';
const AbsentTeacherIllustration = require('../../../img/absent_teacher_illustration.svg')

const AbsentTeacher = props => (
  <div>
    <div className="absent-teacher-container">
      <div className="absent-teacher">
        <img src={AbsentTeacherIllustration}/>
        <h1>Your teacher is not in this lesson!</h1>
      </div>
    </div>
    <a href={`${process.env.EMPIRICAL_BASE_URL}`}><button className="absent-teacher-button">Back To Profile</button></a>
  </div>
)

export default AbsentTeacher;
