import React from 'react';

import ConceptReportsTable from './concept_reports_table';

import { Tooltip, helpIcon } from '../../Shared';
import ItemDropdown from '../../Teacher/components/general_components/dropdown_selectors/item_dropdown';
import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';

const ConceptReports = ({
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
  filteredConceptReportsData,
}) => (
  <div className="admin-report-container">
    <div className="header-container">
      <div className="header-and-tooltip">
        <h1>School Concept Reports</h1>
        <Tooltip
          tooltipText="Each question on Quill targets a specific writing concept. This report shows the number of times the student correctly or incorrectly used the targeted concept to answer the question. You can print this report by downloading a PDF file or export this data by downloading a CSV file. <br/><br/> These reports are updated nightly."
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
        className="admin-concept-dropdown"
        dropdownId="cr-school-select-dropdown"
        items={schoolNames}
        selectedItem={selectedSchool}
      />
      <ItemDropdown
        callback={switchTeacher}
        className="admin-concept-dropdown"
        dropdownId="cr-teacher-select-dropdown"
        items={teacherNames}
        selectedItem={selectedTeacher}
      />
      <ItemDropdown
        callback={switchClassroom}
        className="admin-concept-dropdown"
        dropdownId="cr-classroom-select-dropdown"
        items={classroomNames}
        selectedItem={selectedClassroom}
      />
    </div>
    <ConceptReportsTable data={filteredConceptReportsData} />
  </div>
);

export default ConceptReports;
