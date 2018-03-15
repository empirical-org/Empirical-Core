import * as React from 'react';
import StudentOverview from 'bundles/HelloWorld/components/progress_reports/student_overview';


const ActivityScoresStudentOverview = ({ location }) => {
  const previousLocation="/teachers/admin_dashboard/district_activity_scores";

  return (
    <StudentOverview location={location} previousLocation={previousLocation} />
  );
};

export default ActivityScoresStudentOverview;
