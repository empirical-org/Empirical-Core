import * as React from 'react'

const ActivityPackInformation = ({ activityPackData, classroomData }) => {

  function getStudentCount() {
    let count = 0;
    classroomData.map(classroom => {
      const { students } = classroom;
      if(students && students.length) {
        count += students.length;
      }
    });
    return count;
  }

  return (
    <div className="activity-pack-information-container">
      <div className="pack-sub-container" id="activity-pack">
        <p className="activity-pack-label">Activity Pack</p>
        <p className="activity-pack-data">{activityPackData && activityPackData.name}</p>
      </div>
      <div className="pack-sub-container" id="activities">
        <p className="activity-pack-label">Activities</p>
        <p className="activity-pack-data">{activityPackData && activityPackData.activityCount}</p>
      </div>
      <div className="pack-sub-container" id="classes">
        <p className="activity-pack-label">Classes</p>
        <p className="activity-pack-data">{classroomData && classroomData.length}</p>
      </div>
      <div className="pack-sub-container" id="students">
        <p className="activity-pack-label">Students</p>
        <p className="activity-pack-data">{classroomData && classroomData.length && getStudentCount()}</p>
      </div>
    </div>
  );
}

export default ActivityPackInformation
