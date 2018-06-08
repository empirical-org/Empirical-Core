declare function require(name:string);
import * as React from 'react';
const WatchTeacherIllustration = require('../../../img/watch_teacher_illustration.svg')

const WatchTeacher = props => (
  <div className="watch-teacher-container">
    <div className="watch-teacher">
      <img src={WatchTeacherIllustration}/>
      <h1>Watch Your Teacher!</h1>
    </div>
  </div>
)

export default WatchTeacher;
