import * as React from 'react';

import { Tooltip } from './tooltip';

import { helpIcon } from '../../images';
import CSVDownloadForProgressReport from '../../../Teacher/components/progress_reports/csv_download_for_progress_report';

interface ReportHeaderProps {
  title: string;
  tooltipText: string;
  csvData: any;
  className?: string;
  isFreemiumView?: boolean;
  key?: string;
  keysToOmit?: any;
  valuesToChange?: any;
}
export const ReportHeader = ({ title, tooltipText, csvData, className, isFreemiumView, key, keysToOmit, valuesToChange }: ReportHeaderProps) => {
  return(
    <div className={`header-container ${className || ''}`}>
      <div className="header-and-tooltip">
        <h1>{title}</h1>
        <Tooltip
          tooltipText={tooltipText}
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
      </div>
      {!isFreemiumView && <div className="csv-and-how-we-grade">
        <CSVDownloadForProgressReport className="quill-button focus-on-light small primary contained" data={csvData} key={key} keysToOmit={keysToOmit} valuesToChange={valuesToChange} />
        <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">How we grade</a>
      </div>}
    </div>
  )
}

export default ReportHeader;
