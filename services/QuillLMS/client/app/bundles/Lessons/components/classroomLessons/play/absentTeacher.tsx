declare function require(name:string);
import * as React from 'react';
const AbsentTeacherIllustration = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/night-sky.svg`

const AbsentTeacher = () => (
  <div className="absent-teacher-container full-page-modal-container">
    <div className="absent-teacher full-page-modal">
      <img alt="An illustration of a night sky with clouds, stars, and a moon" src={AbsentTeacherIllustration} />
      <h1>Your teacher has left this lesson.</h1>
      <a className="quill-button focus-on-dark outlined secondary large" href={`${import.meta.env.DEFAULT_URL}`}>Exit lesson</a>
    </div>
  </div>
)

export default AbsentTeacher;
