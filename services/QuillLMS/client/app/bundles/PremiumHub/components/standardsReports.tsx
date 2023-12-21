import * as React from 'react';

import StandardsReportsTable from './standardsReportsTable';

import CSVDownloadForProgressReport from '../../Teacher/components/progress_reports/csv_download_for_progress_report';
import { Tooltip, helpIcon } from '../../Shared';

export const StandardsReports = ({
  csvData,
  filteredStandardsReportsData,
  isFreemiumView
}) => {
  const freemiumClass = isFreemiumView ? 'freemium-view' : ''
  const header = isFreemiumView ? 'Premium Preview: Standards Report' : 'School Standards Reports'
  const tooltipText = isFreemiumView ? 'Subscribe to School or District Premium to unlock this report and more.' : "Each activity on Quill is aligned to a Common Core standard. This report shows the school's overall progress on each of the standards. You can print this report by downloading a PDF file or export this data by downloading a CSV file. The data you see below is capturing historical activity data for your school. <br/><br/> These reports are updated nightly."

  return(
    <div className={`admin-report-container ${freemiumClass}`}>
      <div className="header-container">
        <div className="header-and-tooltip">
          <h1>{header}</h1>
          <Tooltip
            tooltipText={tooltipText}
            tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
          />
        </div>
        {!isFreemiumView && <div className="csv-and-how-we-grade">
          <CSVDownloadForProgressReport data={csvData} />
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">How we grade</a>
        </div>}
      </div>
      <div className="dropdown-container" />
      <StandardsReportsTable data={filteredStandardsReportsData} isFreemiumView={isFreemiumView} />
    </div>
  )
};

export default StandardsReports;
