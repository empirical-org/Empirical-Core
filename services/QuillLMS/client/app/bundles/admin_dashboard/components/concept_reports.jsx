import React from 'react';
import ConceptReportsTable from './concept_reports_table';
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
  <div className="concept-reports-by-classroom progress-reports-2018">
    <div className="meta-overview flex-row space-between">
      <div className="header-and-info">
        <h1>
            School Concept Reports
        </h1>
        <p>
            Each question on Quill targets a specific writing concept. This report shows the number of times the student correctly or incorrectly used the targeted concept to answer the question. You can print this report by downloading a PDF file or export this data by downloading a CSV file.
        </p>
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
