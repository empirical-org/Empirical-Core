import React from 'react';
import ConceptReportsTable from './concept_reports_table';
import ItemDropdown from './item_dropdown.tsx';
import CSVDownloadForProgressReport from '../../HelloWorld/components/progress_reports/csv_download_for_progress_report';

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
            <i className="fa fa-long-arrow-right" />
          </a>
        </div>
    </div>
    <div className="dropdown-container">
      <ItemDropdown
          items={schoolNames}
          callback={switchSchool}
          selectedItem={selectedSchool}
          dropdownId="cr-school-select-dropdown"
        />
      <ItemDropdown
          items={teacherNames}
          callback={switchTeacher}
          selectedItem={selectedTeacher}
          dropdownId="cr-teacher-select-dropdown"
        />
      <ItemDropdown
          items={classroomNames}
          callback={switchClassroom}
          selectedItem={selectedClassroom}
          dropdownId="cr-classroom-select-dropdown"
        />
    </div>
    <ConceptReportsTable data={filteredConceptReportsData} />
  </div>
  );

export default ConceptReports;
