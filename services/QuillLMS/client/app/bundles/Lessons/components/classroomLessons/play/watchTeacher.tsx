declare function require(name:string);
import * as React from 'react';
const WatchTeacherIllustration = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/teacher-presenting-lessons.svg`

const WatchTeacher = () => (
  <div className="watch-teacher-container full-page-modal-container">
    <div className="watch-teacher full-page-modal">
      <img alt="An illustration of a teacher pointing to a smart board" src={WatchTeacherIllustration} />
      <h1>Watch your teacher.</h1>
    </div>
  </div>
)

export default WatchTeacher;
