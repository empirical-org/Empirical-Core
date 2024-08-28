import * as React from 'react';

import CoursePageActivity from './course_page_activity'
import QuillResourceLink from './quill_resource_link'

const expandImgSrc = `${process.env.CDN_URL}/images/icons/s/expand.svg`
const collapseImgSrc = `${process.env.CDN_URL}/images/icons/s/collapse.svg`

const CoursePageUnitTemplate = ({ toggleUnitTemplateExpansion, unitTemplate, expandedUnitTemplateIds, }) => {
  const { display_name, activities, all_oer_articles, all_quill_articles_href, description, oer_unit_teacher_guide, oer_unit_website, oer_unit_number, quill_teacher_guide_href, unit_template_id, } = unitTemplate

  function handleClickToggle() {
    toggleUnitTemplateExpansion(unit_template_id)
  }

  const isExpanded = expandedUnitTemplateIds.includes(unit_template_id)

  let previewAndAssignButton = <button className="quill-button medium contained disabled focus-on-light" disabled={true} type="button">Coming Soon</button>
  let expandOrCollapseButton

  if (unit_template_id) {
    previewAndAssignButton = <a className="quill-button medium green focus-on-light contained" href={`/assign/featured-activity-packs/${unit_template_id}`}>Preview & Assign</a>

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
  let aiEduResourcesSection

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
      <div className="resources-section">
        <h4>OER Project Unit {oer_unit_number} Resources</h4>
        <div className="links">
          <a className="quill-button focus-on-light small outlined grey" href={oer_unit_website} rel="noopener noreferrer" target="_blank">OER Project Unit {oer_unit_number} website</a>
          <a className="quill-button focus-on-light small outlined grey" href={oer_unit_teacher_guide} rel="noopener noreferrer" target="_blank">OER Project Unit {oer_unit_number} teacher guide</a>
          <a className="quill-button focus-on-light small outlined grey" href={all_oer_articles} rel="noopener noreferrer" target="_blank">Download all OER Project Unit {oer_unit_number} articles</a>
        </div>
      </div>
    )

    aiEduResourcesSection = activities.find(act => act.paired_ai_edu_activities?.length) && (
      <div className="resources-section">
        <h4>aiEDU Aligned Resources</h4>
        <div className="links">
          <a className="quill-button focus-on-light small outlined grey" href="https://www.aiedu.org/teach-ai" rel="noopener noreferrer" target="_blank">aiEDU website</a>
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
      {aiEduResourcesSection}
    </section>
  )
}

export default CoursePageUnitTemplate
