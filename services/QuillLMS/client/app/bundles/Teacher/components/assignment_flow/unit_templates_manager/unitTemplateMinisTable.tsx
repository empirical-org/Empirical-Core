import * as React from 'react'
import { DataTable } from '../../../../Shared';

export const UnitTemplateMinisTable = ({ unitTemplates }) => {
  console.log("🚀 ~ file: unitTemplateMinisTable.tsx ~ line 5 ~ UnitTemplateMinisTable ~ unitTemplates", unitTemplates)
  const dataTableFields = [
    { name: "Pack type", attribute:"packType", width: "100px", rowSectionClassName: '', noTooltip: true },
    { name: "Pack name", attribute:"packName", width: "300px", rowSectionClassName: '', noTooltip: true },
    { name: "Tools", attribute:"tools", width: "100px", rowSectionClassName: '', noTooltip: true },
    { name: "Grade Level", attribute:"gradeLevel", width: "50px", rowSectionClassName: '', noTooltip: true },
    { name: "Activities", attribute:"activities", width: "50px", rowSectionClassName: '', noTooltip: true },
    { name: "Duration", attribute:"duration", width: "200px", rowSectionClassName: '', noTooltip: true },
  ];

  function unitTemplateRows() {
    return unitTemplates.map(unitTemplate => {
      const { id, type, name, readability, activities, time, unit_template_category } = unitTemplate;
      return {
        id,
        packType: unit_template_category.label,
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
      className="unit-templates-table"
      headers={dataTableFields}
      rows={unitTemplates && unitTemplateRows()}
    />
  )
}

export default UnitTemplateMinisTable;
