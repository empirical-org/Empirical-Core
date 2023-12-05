import * as React from 'react';

import { Activity } from '../../../../../interfaces/activity';
import { UnitTemplateCategoryInterface, UnitTemplateInterface } from '../../../../../interfaces/unitTemplate';
import { DataTable, Tooltip, uniqueValuesArray } from '../../../../Shared';
import { renderActivityPackTooltipElement } from '../../../helpers/unitTemplates';
import { CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER, READING_FOR_EVIDENCE, READING_TEXTS } from '../assignmentFlowConstants';

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
    { name: "Pack type", attribute:"packType", width: "160px", rowSectionClassName: 'pack-type-section', noTooltip: true, isSortable: true, sortAttribute: 'alphabeticalPackType' },
    { name: "Pack name", attribute:"packName", width: "204px", rowSectionClassName: 'pack-name-section', noTooltip: false, isSortable: true, sortAttribute: 'alphabeticalPackName' },
    { name: "Tools", attribute:"tools", width: "140px", rowSectionClassName: '', noTooltip: true, isSortable: true, sortAttribute: 'alphabeticalTools' },
    { name: "Grade Level", attribute:"gradeLevel", width: "70px", rowSectionClassName: '', noTooltip: true, isSortable: true, sortAttribute: 'chronologicalGradeLevel' },
    { name: "Activities", attribute:"activities", width: "50px", rowSectionClassName: 'activities-section', noTooltip: true, isSortable: true },
    { name: "Duration", attribute:"duration", width: "150px", rowSectionClassName: '', noTooltip: true, isSortable: true, sortAttribute: 'chronologicalDuration' },
  ];

  function getDurationElement(unit_template_category: UnitTemplateCategoryInterface, time: string) {
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

  function activityPackTools(activities) {
    if(!activities.length) { return [] }

    return uniqueValuesArray(activities.map((activity: Activity)=> {
      const { classification } = activity
      const { name } = classification
      return name.replace('Quill ', '')
    })).sort();
  }

  function getToolsElement(activities: Activity[]) {
    if(!activities) { return }

    const tools = activityPackTools(activities)

    return(
      <section className="tools-section">
        {tools.map((tool, i) => {
          const toolName = i === tools.length - 1 ? tool : `${tool},`;
          return <p key={toolName} style={{ color: toolColors[tool] }}>{toolName}</p>
        })}
      </section>
    )
  }

  function getNameElement(name: string, activities: Activity[]) {
    return(
      <Tooltip
        tooltipText={renderActivityPackTooltipElement({ activities })}
        tooltipTriggerText={name}
        tooltipTriggerTextClass="activity-pack-name"
      />
    )
  }

  function getChronologicalGradeLevel(grade_level_range: string) {
    if(!grade_level_range) { return 0 }
    if(grade_level_range.slice(0,2) === '10') { return 10 }
    return parseInt(grade_level_range.slice(0, 1))
  }

  function unitTemplateRows() {
    return unitTemplates.map((unitTemplate: UnitTemplateInterface) => {
      const { id, name, grade_level_range, activities, time, unit_template_category } = unitTemplate;
      const { primary_color } = unit_template_category;
      const nameElement = getNameElement(name, activities);
      const durationElement = getDurationElement(unit_template_category, time);
      const toolsElement = getToolsElement(activities);
      const packUrl = userSignedIn ? `/assign/featured-activity-packs/${id}` : `/activities/packs/${id}`;
      return {
        id,
        link: packUrl,
        alphabeticalPackType: unit_template_category.name,
        packType: <p style={{ color: primary_color }}>{unit_template_category.name}</p>,
        alphabeticalPackName: name,
        packName: nameElement,
        tools: toolsElement,
        alphabeticalTools: activityPackTools(activities)[0],
        gradeLevel: grade_level_range,
        chronologicalGradeLevel: getChronologicalGradeLevel(grade_level_range),
        activities: activities.length,
        duration: durationElement,
        chronologicalDuration: time
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
