import * as React from 'react';

import CoursePageUnitTemplate from '../components/content_hubs/course_page_unit_template'
import { Spinner, } from '../../Shared/index'
import { requestGet, } from '../../../modules/request'

const CoursePage = ({ overviewSection, localStorageKey, contentPageLink, partnerSection, unitTemplatePath,  }) => {
  const [unitTemplates, setUnitTemplates] = React.useState(null)
  const [expandedUnitTemplateIds, setExpandedUnitTemplateIds] = React.useState(window.localStorage.getItem(localStorageKey)?.split(',').map(id => Number(id)))

  React.useEffect(() => {
    requestGet(unitTemplatePath,
      ({ unit_templates, }) => { setUnitTemplates(unit_templates) }
    )
  }, [])

  React.useEffect(() => {
    if (expandedUnitTemplateIds || !unitTemplates) { return }

    setExpandedUnitTemplateIds(unitTemplates.map(unitTemplate => unitTemplate.unit_template_id))
  }, [unitTemplates])

  React.useEffect(() => {
    if (!expandedUnitTemplateIds) { return }

    window.localStorage.setItem(localStorageKey, expandedUnitTemplateIds.join(','))
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

  if (!unitTemplates || !expandedUnitTemplateIds) {
    return (
      <div className="container content-hub-course-page-container white-background-accommodate-footer">
        {contentPageLink}
        <Spinner />
      </div>
    )
  }

  const unitTemplateElements = unitTemplates?.map(unitTemplate => {
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

      {contentPageLink}

      {overviewSection}

      <div className="section-header">
        <h2>Reading for Evidence Activities</h2>
        <div className="toggle-buttons">
          <button className="quill-button focus-on-light medium grey outlined" onClick={expandAllUnitTemplates} type="button">Expand all</button>
          <button className="quill-button focus-on-light medium grey outlined" onClick={collapseAllUnitTemplates} type="button">Collapse all</button>
        </div>
      </div>

      {unitTemplateElements}

      {partnerSection}

    </div>
  )

}

export default CoursePage
