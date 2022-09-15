import * as React from 'react';

const clickInvalidLink = () => alert('Your Premium Subscription has expired. Please visit Quill.org/premium to access this feature.')

const TeacherLink = ({ name, path, isValid, }) => {
  let linkClass = 'green-link teacher-link';
  if (isValid) {
    return(
      <div>
        <a className={linkClass} href={path}>{name}</a>
      </div>
    );
  }
  return(
    <div>
      <a className={linkClass} onClick={clickInvalidLink}>{name}</a>
    </div>
  );
};

export default TeacherLink;
