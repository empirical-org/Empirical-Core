import * as React from 'react'
import { DataTable } from '../../../../Shared';

export const UnitTemplateMinisTable = ({ unitTemplates }) => {
  const dataTableFields = [
    { name: "Pack type", attribute:"packType", width: "200px", rowSectionClassName: '', noTooltip: true },
    { name: "Pack name", attribute:"packName", width: "200px", rowSectionClassName: '', noTooltip: true },
    { name: "Tools", attribute:"tools", width: "200px", rowSectionClassName: '', noTooltip: true },
    { name: "Grade Level", attribute:"gradeLevel", width: "200px", rowSectionClassName: '', noTooltip: true },
    { name: "Activities", attribute:"activities", width: "200px", rowSectionClassName: '', noTooltip: true },
    { name: "Duration", attribute:"duration", width: "200px", rowSectionClassName: '', noTooltip: true },
  ];

  function unitTemplateRows() {
    return unitTemplates.map(unitTemplate => {
      const { id, type, name, readability, activities, time } = unitTemplate;
      return {
        id,
        packType: type.name,
        packName: name,
        tools: '',
        gradeLevel: readability,
        activities: activities.length,
        duration: `${time} mins`
      }
    });
  }

  return(
    <DataTable
      className="unit-template-activity-row-table"
      headers={dataTableFields}
      rows={unitTemplateRows()}
    />
  )
}

export default UnitTemplateMinisTable;
