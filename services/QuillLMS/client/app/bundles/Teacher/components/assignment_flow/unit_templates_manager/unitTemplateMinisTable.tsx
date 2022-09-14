import * as React from 'react'
import { DataTable } from '../../../../Shared';
import { READING_TEXTS } from '../assignmentFlowConstants';

export const UnitTemplateMinisTable = ({ unitTemplates }) => {
  const dataTableFields = [
    { name: "Pack type", attribute:"packType", width: "160px", rowSectionClassName: 'pack-type-section', noTooltip: true },
    { name: "Pack name", attribute:"packName", width: "240px", rowSectionClassName: 'pack-name-section', noTooltip: true },
    { name: "Tools", attribute:"tools", width: "100px", rowSectionClassName: '', noTooltip: true },
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

  function unitTemplateRows() {
    return unitTemplates.map(unitTemplate => {
      const { id, name, readability, activities, time, unit_template_category } = unitTemplate;
      const { primary_color } = unit_template_category;
      const durationElement = getDurationElement(unit_template_category, time);
      return {
        id,
        packType: <p style={{ color: primary_color }}>{unit_template_category.name}</p>,
        packName: name,
        tools: '',
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
