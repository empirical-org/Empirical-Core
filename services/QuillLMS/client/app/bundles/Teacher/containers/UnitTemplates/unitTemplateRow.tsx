import React, {useState} from 'react'

import UnitTemplateActivityRow from './unitTemplateActivityRow';

import { FlagDropdown } from '../../../Shared/index';


const UnitTemplateRow = ({
  handleDelete,
  unitTemplate,
  updateUnitTemplate
}) => {
  console.log("🚀 ~ file: unitTemplateRow.tsx ~ line 13 ~ unitTemplate", unitTemplate)
  const [showActivities, setShowActivities] = useState<boolean>(false);

  function deleteUnitTemplate() {
    const confirm = window.confirm('Are you sure you want to delete ' + unitTemplate.name + '?');
    if (confirm) {
      handleDelete(unitTemplate.id);
    }
  }

  function showHideActivitiesRow() {
    setShowActivities(!showActivities)
  }

  function handleSelectFlag(e) {
    let newUnitTemplate = unitTemplate
    newUnitTemplate.flag = e.target.value
    updateUnitTemplate(newUnitTemplate)
  }

  function handleRemoveActivity(act_id) {
    const confirm = window.confirm('Are you sure you want to remove this activity?');
    if (confirm) {
      let newUnitTemplate = unitTemplate
      let activityIds = unitTemplate.activities.map((a) => a.id)
      activityIds.splice(activityIds.indexOf(act_id), 1)
      newUnitTemplate.activity_ids = activityIds
      updateUnitTemplate(newUnitTemplate)
    }
  }

  function expandOrCollapseButton() {
    const buttonClass = 'focus-on-dark'
    let innerElement;
    const imageLink = showActivities ? 'collapse.svg' : 'expand.svg'
    innerElement = <img alt="expand-and-collapse" src={`https://assets.quill.org/images/shared/${imageLink}`} />
    return <button className={`expand-collapse-button ${buttonClass}`} onClick={showHideActivitiesRow} onKeyPress={showHideActivitiesRow} type="button">{innerElement}</button>
  }

  function renderDiagnostics() {
    const { diagnostic_names } = unitTemplate;
    if(!diagnostic_names.length) {
      return 'N/A'
    }
    return diagnostic_names.map(diagnositc => (
      <p key={diagnositc}>{diagnositc}</p>
    ));
  }

  return (
    <div>
      <tr className="blog-post-row unit-template-row">
        {expandOrCollapseButton()}
        <td className="name-col">{unitTemplate.name}</td>
        <td className="flag-col"><FlagDropdown flag={unitTemplate.flag} handleFlagChange={handleSelectFlag} isLessons={false} /></td>
        <td className="diagnostics-col">{renderDiagnostics()}</td>
        <td className="category-col">{unitTemplate.unit_template_category && unitTemplate.unit_template_category.name}</td>
        <td><a href={`${process.env.DEFAULT_URL}/assign/featured-activity-packs/${unitTemplate.id}`} rel="noopener noreferrer" target="_blank">preview</a></td>
        <td className="edit-col"><a href={`${process.env.DEFAULT_URL}/cms/unit_templates/${unitTemplate.id}/edit`} rel="noopener noreferrer" target="_blank">edit</a></td>
        <td className="delete-col"><button className="delete-unit-template" onClick={deleteUnitTemplate} type="button">delete</button></td>
      </tr>

      {showActivities ? <UnitTemplateActivityRow activities={unitTemplate.activities} handleRemove={handleRemoveActivity} /> : ''}

    </div>
  )
}

export default UnitTemplateRow
