import * as React from 'react';
import { Link } from 'react-router-dom';
import StudentOverview from '../../Teacher/components/progress_reports/student_overview';


export const ActivityScoresStudentOverview = ({ location }) => {
  const previous = '/teachers/premium_hub/district_activity_scores';
  const imageSrc = 'https://assets.quill.org/images/icons/chevron-dark-green.svg';

  return (
    <div className="container gray-background-accommodate-footer">
      <StudentOverview location={location} >
        <Link className='navigate-back' to={previous}>
          <img alt="" src={imageSrc} /> Back to Activity Scores
        </Link>
      </StudentOverview>
    </div>
  );
};

export default ActivityScoresStudentOverview;
