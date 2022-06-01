import * as React from 'react'

import UnitTemplateActivityRow from './unitTemplateActivityRow';

import { FlagDropdown } from '../../../Shared/index';


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

  function handleRemoveActivity(act_id) {
    const confirm = window.confirm('Are you sure you want to remove this activity?');
    if (confirm) {
      const newUnitTemplate = {...unitTemplate}
      let activityIds = unitTemplate.activities.map((a) => a.id)
      activityIds.splice(activityIds.indexOf(act_id), 1)
      newUnitTemplate.activity_ids = activityIds
      updateUnitTemplate(newUnitTemplate)
    }
  }

  function expandOrCollapseButton() {
    const imageLink = showActivities ? 'collapse.svg' : 'expand.svg'
    const innerElement = <img alt="expand-and-collapse" src={`https://assets.quill.org/images/shared/${imageLink}`} />
    return <button className="expand-collapse-button focus-on-light" onClick={handleHideActivitiesRow} type="button">{innerElement}</button>
  }

  function renderDiagnostics() {
    const { diagnostic_names } = unitTemplate;
    if(!diagnostic_names.length) { return 'N/A' }
    return diagnostic_names.map(diagnositc => (
      <p key={diagnositc}>{diagnositc}</p>
    ));
  }

  function handlePreviewClick(e) {
    const { target } = e;
    const { value } = target;
    const link = `${process.env.DEFAULT_URL}/assign/featured-activity-packs/${value}`;
    window.open(link, "_blank");
  }

  function handleEditClick(e) {
    const { target } = e;
    const { value } = target;
    const link = `${process.env.DEFAULT_URL}/cms/unit_templates/${value}/edit`;
    window.open(link, "_blank");
  }

  return (
    <div>
      <tr className="unit-template-row">
        {expandOrCollapseButton()}
        <td className="name-col">{unitTemplate.name}</td>
        <td className="flag-col"><FlagDropdown flag={unitTemplate.flag} handleFlagChange={handleSelectFlag} isLessons={false} /></td>
        <td className="diagnostics-col">{renderDiagnostics()}</td>
        <td className="category-col">{unitTemplate.unit_template_category && unitTemplate.unit_template_category.name}</td>
        <td>
          <button className="action-button interactive-wrapper focus-on-light" onClick={handlePreviewClick} value={unitTemplate.id}>preview</button>
        </td>
        <td className="edit-col">
          <button className="action-button interactive-wrapper focus-on-light" onClick={handleEditClick} value={unitTemplate.id}>edit</button>
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
