import * as React from 'react';
import ActivityScoresTable from './activity_scores_table';
import ItemDropdown from './item_dropdown';
import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';

interface ActivityScoresProps {
  csvData: Object[];
  schoolNames: Item[];
  switchSchool(selectedItem: Item): void;
  selectedSchool: string;
  teacherNames: Item[];
  switchTeacher(selectedItem: Item): void;
  selectedTeacher: string;
  classroomNames: Item[];
  switchClassroom(selectedItem: Item): void;
  selectedClassroom: string,
  filteredClassroomsData: Object[];
}

interface Item {
  id: string;
  name: string;
}


const ActivityScores: React.SFC<ActivityScoresProps> = ({
  csvData,
  schoolNames,
  switchSchool,
  selectedSchool,
  teacherNames,
  switchTeacher,
  selectedTeacher,
  classroomNames,
  switchClassroom,
  selectedClassroom,
  filteredClassroomsData,
}) => {
  return (
    <div className="activities-scores-by-classroom progress-reports-2018">
      <div className="meta-overview flex-row space-between">
        <div className="header-and-info">
          <h1>
            Activity Scores
          </h1>
          <p>
            View the overall average score for each student in an active
            classroom.
          </p>
        </div>
        <div className="csv-and-how-we-grade">
          <CSVDownloadForProgressReport data={csvData} />
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">
            How We Grade
            <i className="fa fa-long-arrow-right" />
          </a>
        </div>
      </div>
      <div className="dropdown-container">
        <ItemDropdown
          items={schoolNames}
          callback={switchSchool}
          selectedItem={selectedSchool}
        />
        <ItemDropdown
          items={teacherNames}
          callback={switchTeacher}
          selectedItem={selectedTeacher}
        />
        <ItemDropdown
          items={classroomNames}
          callback={switchClassroom}
          selectedItem={selectedClassroom}
        />
      </div>
      <ActivityScoresTable data={filteredClassroomsData} />
    </div>
  );
};

export default ActivityScores;
