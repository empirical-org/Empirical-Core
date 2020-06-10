declare function require(name:string);
import * as React from 'react';
const WatchTeacherIllustration = `${process.env.QUILL_CDN_URL}/images/illustrations/teacher-presenting-lessons.svg`

const WatchTeacher = () => (
  <div className="watch-teacher-container">
    <div className="watch-teacher">
      <img alt="An illustration of a teacher pointing to a smart board" src={WatchTeacherIllustration} />
      <h1>Watch your teacher.</h1>
    </div>
  </div>
)

export default WatchTeacher;
