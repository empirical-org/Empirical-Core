import React from 'react';
import StandardsReportsTable from 'bundles/admin_dashboard/components/standards_reports_table';
import ItemDropdown from 'bundles/admin_dashboard/components/item_dropdown';
import CSVDownloadForProgressReport from 'bundles/HelloWorld/components/progress_reports/csv_download_for_progress_report';

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
}) => {
  return (
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
      <div className="dropdown-container">
        <ItemDropdown
          items={schoolNames}
          callback={switchSchool}
          selectedItem={selectedSchool}
          dropdownId='cr-school-select-dropdown'
        />
        <ItemDropdown
          items={teacherNames}
          callback={switchTeacher}
          selectedItem={selectedTeacher}
          dropdownId='cr-teacher-select-dropdown'
        />
        <ItemDropdown
          items={classroomNames}
          callback={switchClassroom}
          selectedItem={selectedClassroom}
          dropdownId='cr-classroom-select-dropdown'
        />
      </div>
      <StandardsReportsTable data={filteredStandardsReportsData} />
    </div>
  );
};

export default StandardsReports;
