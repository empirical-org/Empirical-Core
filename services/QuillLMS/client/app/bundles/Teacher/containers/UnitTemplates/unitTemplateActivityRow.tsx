import * as React from 'react'

import { DataTable, Tooltip, commaSeparatedValuesString, getIconForActivityClassification } from '../../../Shared'

const conceptMaxWidth = '152px';
const readabilityMaxWidth = '280px';

export const UnitTemplateActivityRow = ({
  activities,
  handleRemove
}) => {

  const conceptHeaderElement = (
    <Tooltip
      tooltipText="Activity Category"
      tooltipTriggerText={<button className="action-button interactive-wrapper focus-on-light" onClick={handleOpenAttributesManager}>Concept</button>}
      tooltipTriggerTextStyle={{ maxWidth: conceptMaxWidth }}
    />
  );

  const dataTableFields = [
    { name: "Name", attribute:"name", width: "264px", rowSectionClassName: 'tabbable-field', noTooltip: true },
    { name: "Flag", attribute:"flag", width: "80px", noTooltip: true },
    { name: "Readability", attribute:"readability", width: "64px", noTooltip: true },
    { name: "CCSS", attribute:"ccss", width: readabilityMaxWidth, rowSectionClassName: 'tooltip-section ccss-section' },
    { name: conceptHeaderElement, attribute:"concept", width: conceptMaxWidth, noTooltip: true },
    { name: "Tool", attribute:"tool", width: "88px", noTooltip: true },
    { name: "", attribute:"edit", width: "88px", rowSectionClassName: 'tabbable-field', noTooltip: true },
    { name: "", attribute:"remove", width: "88px", rowSectionClassName: 'tabbable-field', noTooltip: true },
  ];

  function showStandardData(standard) {
    if(!standard || standard && !standard.name) { return 'N/A' }
    const { name, standard_category } = standard;
    if(standard_category && standard_category.name) {
      return(
        <Tooltip
          tooltipText={name}
          tooltipTriggerText={standard_category.name}
          tooltipTriggerTextStyle={{ maxWidth: readabilityMaxWidth }}
        />
      );
    }
    return name;
  }

  function handleActivityClick(e) {
    const { target } = e;
    const { value } = target;
    const link = `${process.env.DEFAULT_URL}${value}`;
    window.open(link, "_blank");
  }

  function handleEditClick(e) {
    const { target } = e;
    const { id, value } = target;
    const link = `${process.env.DEFAULT_URL}/cms/activity_classifications/${id}/activities/${value}/edit`;
    window.open(link, "_blank");
  }

  function handleRemoveClick(e) {
    const { target } = e;
    const { value } = target;
    handleRemove(value);
  }

  function handleOpenAttributesManager(e) {
    window.open(`${process.env.DEFAULT_URL}/cms/attributes_manager/activity_categories`, "_blank");
  }

  function activityRows() {
    return activities.map(activity => {
      const { id, name, flags, readability_grade_level, standard, activity_category, classification, anonymous_path } = activity;
      return {
        id,
        name: <button className="action-button interactive-wrapper focus-on-light" onClick={handleActivityClick} value={anonymous_path}>{name}</button>,
        flag: commaSeparatedValuesString(flags),
        readability: readability_grade_level || 'N/A',
        ccss: showStandardData(standard),
        concept: activity_category && activity_category.name ? activity_category.name : 'N/A',
        tool: classification && classification.id ? getIconForActivityClassification(classification.id) : 'N/A',
        edit: <button className="action-button interactive-wrapper focus-on-light" id={classification.id} onClick={handleEditClick} type="button" value={id}>edit</button>,
        remove: <button className="action-button interactive-wrapper focus-on-light" onClick={handleRemoveClick} type="button" value={id}>remove</button>
      }
    });
  }

  return(
    <DataTable
      className="unit-template-activity-row-table"
      headers={dataTableFields}
      rows={activityRows()}
    />
  )
}

export default UnitTemplateActivityRow
