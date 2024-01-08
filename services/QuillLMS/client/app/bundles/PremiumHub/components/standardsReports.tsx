import * as React from 'react';
import StandardsReportsTable from './standardsReportsTable';
import { ReportHeader } from '../../Shared';

export const StandardsReports = ({
  csvData,
  filteredStandardsReportsData,
  isFreemiumView
}) => {
  const freemiumClass = isFreemiumView ? 'freemium-view' : ''
  const header = isFreemiumView ? 'Premium Preview: Standards Report' : 'School Standards Reports'
  const tooltipText = isFreemiumView ? 'Subscribe to School or District Premium to unlock this report and more.' : "Each activity on Quill is aligned to a Common Core standard. This report shows the school’s overall progress on each of the standards. You can print this report by downloading a PDF file or export this data by downloading a CSV file. The data you see below is capturing historical activity data for your school. <br/><br/> These reports are updated nightly."

  return(
    <div className={`admin-report-container standards-reports-by-classroom ${freemiumClass}`}>
      <ReportHeader
        className="admin-standards-report"
        isFreemiumView={isFreemiumView}
        title={header}
        tooltipText={tooltipText}
        csvData={csvData}
      />
      <StandardsReportsTable data={filteredStandardsReportsData} isFreemiumView={isFreemiumView} />
    </div>
  )
};

export default StandardsReports;
