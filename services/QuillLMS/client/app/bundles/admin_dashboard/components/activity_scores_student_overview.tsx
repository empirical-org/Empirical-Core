import * as React from 'react';
import { Link } from 'react-router-dom';
import StudentOverview from '../../Teacher/components/progress_reports/student_overview';


const ActivityScoresStudentOverview = ({ location }) => {
  const previous = '/teachers/admin_dashboard/district_activity_scores';
  const imageSrc = 'https://assets.quill.org/images/icons/chevron-dark-green.svg';

  return (
    <StudentOverview location={location} >
      <Link className='navigate-back' to={previous}>
        <img alt="" src={imageSrc} /> Back to Activity Scores
      </Link>
    </StudentOverview>
  );
};

export default ActivityScoresStudentOverview;
