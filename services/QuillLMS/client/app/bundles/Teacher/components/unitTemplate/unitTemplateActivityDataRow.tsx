import * as React from 'react'
import { editActivityLink } from '../../helpers/unitTemplates';

const UNSELECTED_TYPE = 'unselected'
const UnitTemplateActivityDataRow = ({activity, handleAdd, handleRemove, type}) => {
console.log("🚀 ~ file: unitTemplateActivityDataRow.tsx ~ line 5 ~ UnitTemplateActivityDataRow ~ activity", activity)
  const [showActivities, setShowActivities] = React.useState(false);

  const showHideActivitiesRow = () => {
    setShowActivities(!showActivities)
  }

  const expandOrCollapseButton = () => {
    const buttonClass = 'focus-on-dark'
    let innerElement;
    const imageLink = showActivities ? 'collapse.svg' : 'expand.svg'
    innerElement = <img alt="expand-and-collapse" src={`https://assets.quill.org/images/shared/${imageLink}`} />
    return <button className={`expand-collapse-button ${buttonClass}`} onClick={showHideActivitiesRow} onKeyPress={showHideActivitiesRow} type="button">{innerElement}</button>
  }

  const secondRow = (
    <tr className="ut-activity-second-row">
      <td />
      <td />
      <td>Description: {activity.description}</td>
      <td colSpan="2">In packs: {activity.unit_template_names.map((ut) => <span key={ut.id}><br />{ut}</span>)}</td>
    </tr>
  )

  function handleAddRemove() {
    if (type === UNSELECTED_TYPE) {
      handleAdd(activity)
    } else {
      handleRemove(activity)
    }
  }

  const previewActivityLink = `${process.env.DEFAULT_URL}/activity_sessions/anonymous?activity_id=${activity.id}`;

  return (
    <span>
      <tr className="ut-activity-row">
        <td><button className="interactive-wrapper focus-on-light" onClick={handleAddRemove} type="button">{type === UNSELECTED_TYPE ? <span className="ut-add-activity">+</span> : <span className="ut-remove-activity">-</span>}</button></td>
        {expandOrCollapseButton()}
        <td className="ut-activity-name-col">
          <a className="data-link" href={previewActivityLink} rel="noopener noreferrer" target="_blank">{activity.name}</a>
        </td>
        <td className="ut-activity-flag-col">{activity.data && activity.data["flag"]}</td>
        <td className="ut-activity-readability-col">{activity.readability_grade_level}</td>
        <td className="ut-activity-cat-col">{activity.activity_category && activity.activity_category.name}</td>
        <td className="ut-activity-class-col">{activity.classification && activity.classification.name}</td>
        <td className="ut-activity-edit-col">
          <a className="data-link" href={editActivityLink(activity.classification.id, activity.id)} rel="noopener noreferrer" target="_blank">edit</a>
        </td>
      </tr>
      {showActivities && secondRow}
    </span>
  )
}

export default UnitTemplateActivityDataRow
