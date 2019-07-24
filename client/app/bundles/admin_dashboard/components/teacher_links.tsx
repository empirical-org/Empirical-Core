import * as React from 'react';
import TeacherLink from './teacher_link';

const TeacherLinks = ({ links, isValid }) => {
  let teacherLinks = links.map((link) => {
    let { name, path, } = link;

    return <TeacherLink key={name} name={name} path={path} isValid={isValid} />;
  });

  return <span>{teacherLinks}</span>;
}

export default TeacherLinks;
