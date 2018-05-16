import React from 'react';
import StandardsReportsTable from './standards_reports_table';
import ItemDropdown from './item_dropdown.tsx';
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
           View concept mastery for a school or district at large
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
      <div className="dropdown-container" />
      <StandardsReportsTable data={filteredStandardsReportsData} />
    </div>
  );

export default StandardsReports;
