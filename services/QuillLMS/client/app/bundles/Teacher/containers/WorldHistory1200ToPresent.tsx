import * as React from 'react';

import { Tooltip, } from '../../Shared/index'

const chevronLeftImgSrc = `${process.env.CDN_URL}/images/icons/xs/chevron-left.svg`
const evidenceImgSrc = `${process.env.CDN_URL}/images/icons/s/tool-evidence.svg`
const expandImgSrc = `${process.env.CDN_URL}/images/icons/s/expand.svg`
const collapseImgSrc = `${process.env.CDN_URL}/images/icons/s/collapse.svg`
const headerImgSrc = `${process.env.CDN_URL}/images/pages/content_hub/world_history_1200_to_present@2x.png`

const imageCreditTooltipText = '<p><a href="https://purl.stanford.edu/cr193ys2567" rel="noopener noreferrer" target="_blank">"A New and Accurat Map of the World Drawne according to ye truest Descriptions lastest Discoveries & best observations yt have beene made by English or Strangers."</a> by John Speed (1552-1629), <a href="https://exhibits.stanford.edu/ruderman" target="_blank" rel="noopener noreferrer">The Barry Lawrence Ruderman Map Collection</a>, <a href="https://www.stanford.edu/" target="_blank" rel="noopener noreferrer">Stanford University</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></p>'

const LOCAL_STORAGE_KEY = 'worldHistory1200ToPresentExpandedUnitTemplateIds'

const ComingSoonTooltip = ({ tooltipTrigger, }) => {
  return (
    <Tooltip
      tooltipText="Coming soon!"
      tooltipTriggerText={tooltipTrigger}
  />)
}

const QuillResourceLink = ({ text, href, }) => {
  const className = "quill-button focus-on-light outlined medium grey"

  if (href) {
    return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{text}</a>
  }

  return (
    <ComingSoonTooltip
      tooltipTrigger={<button className={className} disabled={true}>{text}</button>}
    />
  )
}

const CoursePageActivity = ({ activity, }) => {
  const { activity_id, display_name, description, paired_oer_asset_name, paired_oer_asset_link, assigned_student_count, completed_student_count, link_for_report, average_score, } = activity

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

  let resultsSection = (
    <div className="results-section">
      <Tooltip
        tooltipText="There are no assigned activities. Once activities are assigned and completed, you can view results."
        tooltipTriggerText={<button className="quill-button focus-on-light small contained disabled" disabled={true}>View results</button>}
      />
    </div>
  )

  if (link_for_report) {
    resultsSection = (
      <div className="results-section">
        <a className="quill-button focus-on-light small contained green" href={link_for_report}>View results</a>
        <p>{renderPieChart()} {completed_student_count} of {assigned_student_count} student{assigned_student_count === 1 ? '' : 's'} completed</p>
        {average_score && <p>Average score: {average_score}%</p>}
      </div>
    )
  }

  return (
    <div className="course-page-activity">
      <img alt="" className="evidence-img" src={evidenceImgSrc} />
      <div className="activity-information">
        <h5>{display_name}</h5>
        <p>{description}</p>
        {paired_oer_asset_link && paired_oer_asset_name && (
          <p className="oer-asset-line">Optional Paired OER Activity: <a href={paired_oer_asset_link} target="_blank" rel="noopener noreferrer">{paired_oer_asset_name}</a></p>
        )}
      </div>
      {resultsSection}
    </div>
  )
}

const CoursePageUnitTemplate = ({ toggleUnitTemplateExpansion, unitTemplate, expandedUnitTemplateIds, }) => {
  const { display_name, activities, all_oer_articles, all_quill_articles_href, description, oer_unit_teacher_guide, oer_unit_website, oer_unit_number, quill_teacher_guide_href, unit_template_id, } = unitTemplate

  function handleClickToggle() {
    toggleUnitTemplateExpansion(unit_template_id)
  }

  const isExpanded = expandedUnitTemplateIds.includes(unit_template_id)

  let previewAndAssignButton = <button className="quill-button medium contained disabled focus-on-light" disabled={true}>Coming Soon</button>
  let expandOrCollapseButton

  if (unit_template_id) {
    let previewAndAssignButtonClassName = "quill-button medium green focus-on-light "
    previewAndAssignButtonClassName += isExpanded ? 'contained' : 'outlined'

    previewAndAssignButton = <a className={previewAndAssignButtonClassName} href={`/assign/featured-activity-packs/${unit_template_id}`}>Preview & assign</a>

    const expandOrCollapseButtonImageSrc = isExpanded ? collapseImgSrc : expandImgSrc
    const expandOrCollapseButtonAriaLabel = isExpanded ? `Collapse ${display_name} activities` : `Expand ${display_name} activities`

    expandOrCollapseButton = (
      <button
        aria-label={expandOrCollapseButtonAriaLabel}
        className="interactive-wrapper focus-on-light"
        onClick={handleClickToggle}
        type="button"
      >
        <img alt="" src={expandOrCollapseButtonImageSrc} />
      </button>
    )
  }

  let quillResourceLinks
  let activitiesSection
  let oerResourcesSection

  if (isExpanded) {
    quillResourceLinks = (
      <div className="quill-resource-links">
        <QuillResourceLink href={quill_teacher_guide_href} text="Quill Teacher Guide" />
        <QuillResourceLink href={all_quill_articles_href} text="Download all unit texts" />
      </div>
    )

    activitiesSection = (
      <div className="activities-section">
        <h4>Activities</h4>
        {activities.map(activity => <CoursePageActivity activity={activity} key={activity.display_name} />)}
      </div>
    )

    oerResourcesSection = oer_unit_number && (
      <div className="oer-resources-section">
        <h4>OER Project Aligned Resources</h4>
        <div className="links">
          <a className="quill-button focus-on-light small outlined grey" href={oer_unit_website} target='_blank' rel='noopener noreferrer'>OER Unit {oer_unit_number} website</a>
          <a className="quill-button focus-on-light small outlined grey" href={oer_unit_teacher_guide} target='_blank' rel='noopener noreferrer'>OER Unit {oer_unit_number} teacher guide</a>
          <a className="quill-button focus-on-light small outlined grey" href={all_oer_articles} target='_blank' rel='noopener noreferrer'>Download all OER Unit {oer_unit_number} articles</a>
        </div>
      </div>
    )
  }

  return (
    <section className="course-page-unit-template">
      <div className="unit-template-header">
        <div className="name-and-buttons">
          <h3>{display_name}</h3>
          <div>
            {previewAndAssignButton}
            {expandOrCollapseButton}
          </div>
        </div>
        <p className="unit-template-description">{description}</p>
        {quillResourceLinks}
      </div>
      {activitiesSection}
      {oerResourcesSection}
    </section>
  )
}

const WorldHistory1200ToPresent = ({ unitTemplates, }) => {
  const [expandedUnitTemplateIds, setExpandedUnitTemplateIds] = React.useState(window.localStorage.getItem(LOCAL_STORAGE_KEY)?.split(',').map(id => Number(id)) || unitTemplates.map(ut => ut.unit_template_id))

  React.useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, expandedUnitTemplateIds.join(','))
  }, [expandedUnitTemplateIds])

  function expandAllUnitTemplates() {
    setExpandedUnitTemplateIds(unitTemplates.map(ut => ut.unit_template_id))
  }

  function collapseAllUnitTemplates() {
    setExpandedUnitTemplateIds([])
  }

  function toggleUnitTemplateExpansion(unitTemplateId) {
    const newExpandedUnitTemplateIds = expandedUnitTemplateIds.includes(unitTemplateId) ? expandedUnitTemplateIds.filter(id => id !== unitTemplateId) : expandedUnitTemplateIds.concat(unitTemplateId)
    setExpandedUnitTemplateIds(newExpandedUnitTemplateIds)
  }

  const unitTemplateElements = unitTemplates.map(unitTemplate => {
    return (
      <CoursePageUnitTemplate
        expandedUnitTemplateIds={expandedUnitTemplateIds}
        key={unitTemplate.display_name}
        toggleUnitTemplateExpansion={toggleUnitTemplateExpansion}
        unitTemplate={unitTemplate}
      />
    )
  })

  return (
    <div className="container content-hub-course-page-container white-background-accommodate-footer">

      <a className="quill-button medium outlined grey icon focus-on-light" href="/social_studies"><img alt="" src={chevronLeftImgSrc} />View all social studies activities</a>

      <div className="overview">
        <div>
          <h1>World History: 1200 CE - Present</h1>
          <p className="overview-description">World history, or the story of our past, belongs to everyone: it helps us understand where we've come from, how we got here, and where we might go next. In this course, students explore that shared human story beginning with the rise of complex, connected societies and ending with the emergence of the globalized world in which we live today.</p>
          <p className="overview-description">Quill Reading for Evidence activities provide a deep dive into key moments and movements from the period spanning 1200 CE to the present, helping students expand their content knowledge while building core reading and writing skills.</p>
          <a className="quill-button contained medium green focus-on-light" href="">View Teacher Resources</a>
        </div>
        <div>
          <img alt="" src={headerImgSrc} />
          <Tooltip tooltipText={imageCreditTooltipText} tooltipTriggerText="Image credit" tooltipTriggerTextClass="image-attribution-tooltip" />
        </div>
      </div>

      <div className="section-header">
        <h2>Reading for Evidence Activities</h2>
        <div className="toggle-buttons">
          <button className="quill-button focus-on-light medium grey outlined" onClick={expandAllUnitTemplates} type="button">Expand all</button>
          <button className="quill-button focus-on-light medium grey outlined" onClick={collapseAllUnitTemplates} type="button">Collapse all</button>
        </div>
      </div>

      {unitTemplateElements}

      <div className="partner-section">
        <h2>Paired with the OER Project for deeper learning</h2>
        <p>OER Project provides open educational resources to empower teachers to better serve their students through innovative curricula and teaching tools. Currently, OER Project offers three complete social studies courses: Big History Project (BHP), World History Project (WHP), and World History AP (WH AP). Each course includes primary and secondary source readings, videos, and learning activities, along with scaffolded supports like leveled texts. Want to learn more? Visit <a href="www.oerproject.com" rel="noopener noreferrer" target="_blank">www.oerproject.com</a>!</p>
        <a className="quill-button medium outlined grey focus-on-light" href="/social_studies">Learn More About Quill’s Social Studies Activities</a>
      </div>

    </div>
  )
}

export default WorldHistory1200ToPresent
