import * as React from 'react';

const clickInvalidLink = () => alert('Your Premium Subscription has expired. Please visit Quill.org/premium to access this feature.')

const TeacherLink = ({ name, path, isValid, }) => {
  let linkClass = 'green-link teacher-link';
  if (isValid) {
    /* eslint-disable react/jsx-no-target-blank */
    return(
      <div>
        <a className={linkClass} href={path} target="_blank">{name}</a>
      </div>
    );
    /* eslint-enable react/jsx-no-target-blank */
  }
  return(
    <div>
      <a className={linkClass} onClick={clickInvalidLink}>{name}</a>
    </div>
  );
};

export default TeacherLink;
