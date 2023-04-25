import * as React from 'react';

import { DataTable, NOT_APPLICABLE, Tooltip, getIconForActivityClassification } from '../../../Shared';
import { editActivityLink } from '../../helpers/unitTemplates';

const conceptMaxWidth = '152px';
const readabilityMaxWidth = '280px';

export const UnitTemplateActivityRow = ({
  activities,
  handleRemove
}) => {

  const conceptHeaderElement = (
    <Tooltip
      tooltipText="Activity Category"
      tooltipTriggerText={<a className="action-button focus-on-light" href={`${import.meta.env.VITE_DEFAULT_URL}/cms/attributes_manager/activity_categories`} rel="noopener noreferrer" target="_blank">Concept</a>}
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
    if(!standard || standard && !standard.name) { return NOT_APPLICABLE }
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

  function handleRemoveClick(e) {
    const { target } = e;
    const { value } = target;
    handleRemove(value);
  }

  function activityRows() {
    return activities.map(activity => {
      const { id, name, flags, readability_grade_level, standard, activity_category, classification, anonymous_path } = activity;
      const activityLink = `${import.meta.env.VITE_DEFAULT_URL}${anonymous_path}`;
      return {
        id,
        name: <a className="action-button focus-on-light" href={activityLink} rel="noopener noreferrer" target="_blank">{name}</a>,
        flag: flags && flags.length ? flags.join(', ') : NOT_APPLICABLE,
        readability: readability_grade_level || NOT_APPLICABLE,
        ccss: showStandardData(standard),
        concept: activity_category && activity_category.name ? activity_category.name : NOT_APPLICABLE,
        tool: classification && classification.id ? getIconForActivityClassification(classification.id) : NOT_APPLICABLE,
        edit: classification && classification.id ? <a className="action-button focus-on-light" href={editActivityLink(classification.id, id)} rel="noopener noreferrer" target="_blank">edit</a> : NOT_APPLICABLE,
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
