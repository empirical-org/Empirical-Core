import * as React from 'react';
import ActivityScoresTable from './activity_scores_table';
import ItemDropdown from '../../Teacher/components/general_components/dropdown_selectors/item_dropdown';
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
            Each activity takes about 10-20 minutes to complete, and students receive a score out of 100 points based on their performance. Click on a student’s name to see a report and print it as a PDF. You can print this report by downloading a PDF file or export this data by downloading a CSV file.
          </p>
          <p><b>These reports are updated nightly.</b></p>
        </div>
        <div className="csv-and-how-we-grade">
          <CSVDownloadForProgressReport data={csvData} />
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">
            How We Grade
            <i className="fas fa-long-arrow-alt-right" />
          </a>
        </div>
      </div>
      <div className="dropdown-container" id="flexed">
        <ItemDropdown
          callback={switchSchool}
          className="admin-activity-dropdown"
          items={schoolNames}
          selectedItem={selectedSchool}
        />
        <ItemDropdown
          callback={switchTeacher}
          className="admin-activity-dropdown"
          items={teacherNames}
          selectedItem={selectedTeacher}
        />
        <ItemDropdown
          callback={switchClassroom}
          className="admin-activity-dropdown"
          items={classroomNames}
          selectedItem={selectedClassroom}
        />
      </div>
      <ActivityScoresTable data={filteredClassroomsData} />
    </div>
  );
};

export default ActivityScores;
