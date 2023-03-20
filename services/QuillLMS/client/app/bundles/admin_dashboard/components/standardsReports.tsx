import * as React from 'react';
import StandardsReportsTable from './standardsReportsTable';
import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';

export const StandardsReports = ({
  csvData,
  filteredStandardsReportsData,
  isFreemiumView
}) => {
  const header = isFreemiumView ? 'Premium Preview: Standards Report' : 'School Standards Reports'
  const subHeader = isFreemiumView ? 'Subscribe to School or District Premium to unlock this report and more.' : "Each activity on Quill is aligned to a Common Core standard. This report shows the school’s overall progress on each of the standards. You can print this report by downloading a PDF file or export this data by downloading a CSV file. The data you see below is capturing historical activity data for your school."
  return(
    <div className="standards-reports-by-classroom progress-reports-2018">
      <div className="meta-overview flex-row space-between">
        <div className="header-and-info">
          <h1>{header}</h1>
          <p>{subHeader}</p>
          <p><b>These reports are updated nightly.</b></p>
        </div>
        {!isFreemiumView && <div className="csv-and-how-we-grade">
          <CSVDownloadForProgressReport data={csvData} />
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">
              How We Grade
            <i className="fas fa-long-arrow-alt-right" />
          </a>
        </div>}
      </div>
      <div className="dropdown-container" />
      <StandardsReportsTable data={filteredStandardsReportsData} isFreemiumView={isFreemiumView} />
    </div>
  )
};

export default StandardsReports;
