import * as React from 'react';
import StudentOverview from 'bundles/Teacher/components/progress_reports/student_overview';
import { Link } from 'react-router';


const ActivityScoresStudentOverview = ({ location }) => {
  const previous = '/teachers/admin_dashboard/district_activity_scores';
  const imageSrc = 'https://assets.quill.org/images/icons/chevron-dark-green.svg';

  return (
    <StudentOverview location={location} >
      <Link to={previous} className='navigate-back'>
        <img src={imageSrc} alt=""/> Back to Activity Scores
      </Link>
    </StudentOverview>
  );
};

export default ActivityScoresStudentOverview;
