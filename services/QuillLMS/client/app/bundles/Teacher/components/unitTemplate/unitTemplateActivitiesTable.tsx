import * as React from 'react';

import { DataTable, Tooltip, getIconForActivityClassification } from '../../../Shared/index';
import { editActivityLink, previewActivityLink } from '../../helpers/unitTemplates';

const conceptMaxWidth = '152px';

const UnitTemplateActivitiesTable = ({ activities, handleAddActivity }) => {
console.log("🚀 ~ file: unitTemplateActivitiesTable.tsx ~ line 9 ~ UnitTemplateActivitiesTable ~ activities", activities)

  const conceptHeaderElement = (
    <Tooltip
      tooltipText="Activity Category"
      tooltipTriggerText={<a className="action-button focus-on-light" href={`${process.env.DEFAULT_URL}/cms/attributes_manager/activity_categories`} rel="noopener noreferrer" target="_blank">Concept</a>}
      tooltipTriggerTextStyle={{ maxWidth: conceptMaxWidth }}
    />
  );

  const dataTableFields = [
    { name: "", attribute:"addActivity", width: "32px", noTooltip: true },
    { name: "Name", attribute:"name", width: "208px", rowSectionClassName: 'tabbable-field', noTooltip: true },
    { name: "Description", attribute:"description", width: "232px", rowSectionClassName: 'tooltip-section description-section', noTooltip: true },
    { name: "In packs", attribute:"inPacks", width: "232px", rowSectionClassName: 'in-packs-section', noTooltip: true },
    { name: "Flag", attribute:"flag", width: "80px", noTooltip: true },
    { name: "Readability", attribute:"readability", width: "64px", noTooltip: true },
    { name: conceptHeaderElement, attribute:"concept", width: conceptMaxWidth, noTooltip: true },
    { name: "Tool", attribute:"tool", width: "88px", noTooltip: true },
    { name: "", attribute:"edit", width: "88px", rowSectionClassName: 'tabbable-field', noTooltip: true }
  ];

  function displayInPacksInfo(unitTemplateNames: string[]) {
    return(
      <React.Fragment>
        {unitTemplateNames.map(name => (<p>{name}</p>))}
      </React.Fragment>
    );
  }


  function activityRows() {
    return activities.map(activity => {
      const { id, name, flags, activity_category, classification, readability_grade_level, description, unit_template_names } = activity;
      return {
        id,
        addActivity: <button className="add-activity-button interactive-wrapper focus-on-light" onClick={() => handleAddActivity(activity)}>+</button>,
        name: <a className="data-link focus-on-light" href={previewActivityLink(id)} rel="noopener noreferrer" target="_blank">{name}</a>,
        description: description || 'N/A',
        inPacks: displayInPacksInfo(unit_template_names),
        flag: flags && flags.length ? flags.join(', ') : 'N/A',
        readability: readability_grade_level || 'N/A',
        concept: activity_category && activity_category.name ? activity_category.name : 'N/A',
        tool: classification && classification.id ? getIconForActivityClassification(classification.id) : 'N/A',
        edit: <a className="data-link focus-on-light" href={editActivityLink(classification.id, id)} rel="noopener noreferrer" target="_blank">edit</a>
      }
    });
  }

  return(
    <DataTable
      className="unit-template-activity-row-table"
      headers={dataTableFields}
      rows={activityRows()}
    />
  );
}

export default UnitTemplateActivitiesTable
