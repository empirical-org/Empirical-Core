import React from 'react';
import StandardsReportsTable from './standards_reports_table';
import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';

const StandardsReports = ({
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
  filteredStandardsReportsData,
}) => (
  <div className="standards-reports-by-classroom progress-reports-2018">
    <div className="meta-overview flex-row space-between">
      <div className="header-and-info">
        <h1>
            School Standards Reports
        </h1>
        <p>
            Each activity on Quill is aligned to a Common Core standard. This report shows the school’s overall progress on each of the standards. You can print this report by downloading a PDF file or export this data by downloading a CSV file. The data you see below is capturing historical activity data for your school.
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
    <div className="dropdown-container" />
    <StandardsReportsTable data={filteredStandardsReportsData} />
  </div>
);

export default StandardsReports;
