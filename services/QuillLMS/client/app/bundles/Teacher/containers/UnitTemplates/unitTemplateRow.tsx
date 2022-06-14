import * as React from 'react'

import UnitTemplateActivityRow from './unitTemplateActivityRow';

import { FlagDropdown } from '../../../Shared/index';
import { editActivityPackLink } from '../../helpers/unitTemplates';


const UnitTemplateRow = ({
  handleDelete,
  unitTemplate,
  updateUnitTemplate
}) => {
  const [showActivities, setShowActivities] = React.useState<boolean>(false);

  function deleteUnitTemplate() {
    const confirm = window.confirm('Are you sure you want to delete ' + unitTemplate.name + '?');
    if (confirm) {
      handleDelete(unitTemplate.id);
    }
  }

  function handleHideActivitiesRow() {
    setShowActivities(!showActivities)
  }

  function handleSelectFlag(e) {
    const { target } = e;
    const { value } = target;
    const newUnitTemplate = {...unitTemplate}
    newUnitTemplate.flag = value
    updateUnitTemplate(newUnitTemplate)
  }

  function handleRemoveActivity(activityId: string) {
    const confirm = window.confirm('Are you sure you want to remove this activity?');
    if (confirm) {
      const newUnitTemplate = {...unitTemplate}
      const activityIds = unitTemplate.activities.map((activity) => activity.id)
      activityIds.splice(activityIds.indexOf(parseInt(activityId)), 1)
      newUnitTemplate.activity_ids = activityIds
      updateUnitTemplate(newUnitTemplate)
    }
  }

  function expandOrCollapseButton() {
    const imageLink = showActivities ? 'collapse.svg' : 'expand.svg';
    const imageAlt = showActivities ? 'Collapse' : 'Expand';
    const innerElement = <img alt={imageAlt} src={`https://assets.quill.org/images/shared/${imageLink}`} />
    return <button className="expand-collapse-button focus-on-light" onClick={handleHideActivitiesRow} type="button">{innerElement}</button>
  }

  function renderDiagnostics() {
    const { diagnostic_names } = unitTemplate;
    if(!diagnostic_names.length) { return 'N/A' }
    return diagnostic_names.map(diagnostic => (
      <p key={diagnostic}>{diagnostic}</p>
    ));
  }

  const previewLink = `${process.env.DEFAULT_URL}/assign/featured-activity-packs/${unitTemplate.id}`;

  return (
    <div>
      <tr className="unit-template-row">
        {expandOrCollapseButton()}
        <td className="name-col">{unitTemplate.name}</td>
        <td className="flag-col"><FlagDropdown flag={unitTemplate.flag} handleFlagChange={handleSelectFlag} isLessons={false} /></td>
        <td className="diagnostics-col">{renderDiagnostics()}</td>
        <td className="category-col">{unitTemplate.unit_template_category && unitTemplate.unit_template_category.name}</td>
        <td>
          <a className="action-button focus-on-light" href={previewLink} rel="noopener noreferrer" target="_blank">preview</a>
        </td>
        <td className="edit-col">
          <a className="action-button focus-on-light" href={editActivityPackLink(unitTemplate.id)} rel="noopener noreferrer" target="_blank">edit</a>
        </td>
        <td className="delete-col">
          <button className="action-button interactive-wrapper focus-on-light" onClick={deleteUnitTemplate} type="button">delete</button>
        </td>
      </tr>

      {showActivities && <UnitTemplateActivityRow activities={unitTemplate.activities} handleRemove={handleRemoveActivity} />}

    </div>
  )
}

export default UnitTemplateRow
