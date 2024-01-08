import * as React from 'react';

import { Tooltip } from './tooltip';

import { helpIcon } from '../../images';
import CSVDownloadForProgressReport from '../../../Teacher/components/progress_reports/csv_download_for_progress_report';

interface ReportHeaderProps {
  csvData?: any;
  className?: string;
  downloadReportButton?: any
  isFreemiumView?: boolean;
  key?: string;
  keysToOmit?: any;
  headerText: string;
  subHeaderElement?: string;
  tooltipText?: string;
  valuesToChange?: any;
}
export const ReportHeader = ({ headerText, subHeaderElement, tooltipText, csvData, className, isFreemiumView, key, keysToOmit, valuesToChange, downloadReportButton }: ReportHeaderProps) => {

  function renderHeaderText() {
    if(subHeaderElement) {
      return(
        <div>
          <div className="header-subheader-container">
            <h2>{headerText}</h2>
            {tooltipText && <Tooltip
              tooltipText={tooltipText}
              tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
            />}
          </div>
          {subHeaderElement}
        </div>
      )
    }
    return(
      <React.Fragment>
        <h1>{headerText}</h1>
        {tooltipText && <Tooltip
          tooltipText={tooltipText}
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />}
      </React.Fragment>
    )
  }

  function renderRightSection() {
    if(isFreemiumView) { return }
    const button = downloadReportButton || <CSVDownloadForProgressReport className="quill-button focus-on-light small primary contained" data={csvData} key={key} keysToOmit={keysToOmit} valuesToChange={valuesToChange} />

    return(
      <div className="csv-and-how-we-grade">
        {button}
        <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">How we grade</a>
      </div>
    )
  }

  return(
    <div className={`header-container ${className || ''}`}>
      <div className="header-and-tooltip">
        {renderHeaderText()}
      </div>
      {renderRightSection()}
    </div>
  )
}

export default ReportHeader;
