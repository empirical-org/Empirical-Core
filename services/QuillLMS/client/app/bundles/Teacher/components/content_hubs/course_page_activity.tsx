import * as React from 'react';

import { Tooltip, pluralize, } from '../../../Shared/index'

const evidenceImgSrc = `${process.env.CDN_URL}/images/icons/s/tool-evidence.svg`

const assetLink = (link, name) => (<a href={link} rel="noopener noreferrer" target="_blank">{name}</a>)

const CoursePageActivity = ({ activity, }) => {
  const { display_name, description, paired_oer_asset_name, paired_oer_asset_link, assigned_student_count, completed_student_count, link_for_report, average_score, preview_href, paired_ai_edu_activities, } = activity

  const renderPieChart = () => {
    const rawPercent = completed_student_count / assigned_student_count;
    const percent = rawPercent > 100 ? 100 : Math.round(rawPercent * 100) / 100;
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const pathData = `M 1 0 A 1 1 0 ${largeArcFlag} 1 ${Math.cos(2 * Math.PI * percent)} ${Math.sin(2 * Math.PI * percent)} L 0 0`;
    return (
      <svg className="course-page-pie-chart" viewBox="-1 -1 2 2">
        <path d={pathData} fill="#348fdf" />
      </svg>
    );
  }

  const renderPairedActivityLinks = (pairedActivities) => {
    const activityLinks = pairedActivities.map(({ name, link, }) => {
      return assetLink(link, name)
    })

    if (activityLinks.length === 1) {
      return activityLinks
    }

    activityLinks.splice(1, 0, ' and ')

    return activityLinks
  }

  let resultsSection = (
    <div className="results-section">
      <Tooltip
        tooltipText="There are no assigned activities. Once activities are assigned and completed, you can view results."
        tooltipTriggerText={<button className="quill-button focus-on-light small contained disabled" disabled={true} type="button">View results</button>}
      />
    </div>
  )

  if (link_for_report) {
    resultsSection = (
      <div className="results-section">
        <a className="quill-button focus-on-light small contained green" href={link_for_report}>View results</a>
        <p>{renderPieChart()} {completed_student_count} of {assigned_student_count} student{assigned_student_count === 1 ? '' : 's'} completed</p>
        {average_score !== null && <p>Average score: {average_score}%</p>}
      </div>
    )
  }

  return (
    <div className="course-page-activity">
      <img alt="" className="evidence-img" src={evidenceImgSrc} />
      <div className="activity-information">
        <h5>{preview_href ? <a href={preview_href} rel="noopener noreferrer" target="_blank">{display_name}</a> : display_name}</h5>
        <p>{description}</p>
        {paired_oer_asset_link && paired_oer_asset_name && (
          <p className="asset-line"><span>Optional Paired OER Project Activity:</span> {assetLink(paired_oer_asset_link, paired_oer_asset_name)}</p>
        )}
        {paired_ai_edu_activities?.length && (
          <p className="asset-line"><span>Optional Paired aiEDU {pluralize(paired_ai_edu_activities.length, 'Activity', 'Activities')}:</span> {renderPairedActivityLinks(paired_ai_edu_activities)}</p>
        )}
      </div>
      {resultsSection}
    </div>
  )
}

export default CoursePageActivity
