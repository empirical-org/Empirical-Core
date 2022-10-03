import * as React from 'react'

import { DataTable, uniqueValuesArray } from '../../../../Shared';
import { READING_TEXTS, READING_FOR_EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, PROOFREADER, LESSONS } from '../assignmentFlowConstants';
import { UnitTemplateInterface } from '../../../../../interfaces/unitTemplate';
import { Activity } from '../../../../../interfaces/activity';

export const UnitTemplateMinisTable = ({ unitTemplates, userSignedIn }) => {
  const toolColors = {
    [READING_FOR_EVIDENCE]: '#2C7F9B',
    [CONNECT]: '#DF9E3D',
    [DIAGNOSTIC]: '#EB4F47',
    [GRAMMAR]: '#9035D6',
    [PROOFREADER]: '#4D8DD9',
    [LESSONS]: '#AD287B'
  }
  const dataTableFields = [
    { name: "Pack type", attribute:"packType", width: "160px", rowSectionClassName: 'pack-type-section', noTooltip: true },
    { name: "Pack name", attribute:"packName", width: "190px", rowSectionClassName: 'pack-name-section', noTooltip: true },
    { name: "Tools", attribute:"tools", width: "140px", rowSectionClassName: '', noTooltip: true },
    { name: "Grade Level", attribute:"gradeLevel", width: "70px", rowSectionClassName: '', noTooltip: true },
    { name: "Activities", attribute:"activities", width: "50px", rowSectionClassName: 'activities-section', noTooltip: true },
    { name: "Duration", attribute:"duration", width: "150px", rowSectionClassName: '', noTooltip: true },
  ];

  function getDurationElement(unit_template_category, time) {
    const { name } = unit_template_category
    if(name === READING_TEXTS) {
      return(
        <section className="duration-section">
          <p>{`${time} mins`}</p>
          <section className="tags-section">
            <p className="duration-beta-tag">BETA</p>
            <p className="duration-new-tag">NEW</p>
          </section>
        </section>
      )
    }
    return `${time} mins`;
  }

  function getToolsElement(activities: Activity[]) {
    if(!activities) { return }

    const tools = uniqueValuesArray(activities.map(activity => {
      const { classification } = activity
      const { name } = classification
      return name.replace('Quill ', '')
    }))

    return(
      <section className="tools-section">
        {tools.map((tool, i) => {
          const toolName = i === tools.length - 1 ? tool : `${tool},`;
          return <p style={{ color: toolColors[tool] }}>{toolName}</p>
        })}
      </section>
    )
  }

  function unitTemplateRows() {
    return unitTemplates.map((unitTemplate: UnitTemplateInterface) => {
      const { id, name, readability, activities, time, unit_template_category } = unitTemplate;
      const { primary_color } = unit_template_category;
      const durationElement = getDurationElement(unit_template_category, time);
      const toolsElement = getToolsElement(activities);
      const packUrl = userSignedIn ? `/assign/featured-activity-packs/${id}` : `/activities/packs/${id}`;
      return {
        id,
        link: packUrl,
        packType: <p style={{ color: primary_color }}>{unit_template_category.name}</p>,
        packName: name,
        tools: toolsElement,
        gradeLevel: readability,
        activities: activities.length,
        duration: durationElement
      }
    });
  }

  return(
    <DataTable
      className="unit-templates-table"
      headers={dataTableFields}
      rows={unitTemplates && unitTemplateRows()}
    />
  )
}

export default UnitTemplateMinisTable;
