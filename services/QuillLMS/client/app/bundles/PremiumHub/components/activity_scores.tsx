import * as React from 'react';
import ItemDropdown from '../../Teacher/components/general_components/dropdown_selectors/item_dropdown';
import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';
import ActivityScoresTable from './activity_scores_table';
import { Tooltip, helpIcon } from '../../Shared';

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
    <div className="admin-report-container">
      <div className="header-container">
        <div className="header-and-tooltip">
          <h1>Activity Scores</h1>
          <Tooltip
            tooltipText="Each activity takes about 10-20 minutes to complete, and students receive a score out of 100 points based on their performance. Click on a student’s name to see a report and print it as a PDF. You can print this report by downloading a PDF file or export this data by downloading a CSV file. <br/><br/> These reports are updated nightly."
            tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
          />
        </div>
        <div className="csv-and-how-we-grade">
          <CSVDownloadForProgressReport data={csvData} />
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">How we grade</a>
        </div>
      </div>
      <div className="dropdowns-container">
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
