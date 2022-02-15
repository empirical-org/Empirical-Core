import * as React from 'react'


const UnitTemplateActivityDataRow = ({activity}) => {
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
      <td>Description: {activity.description}</td>
      <td colSpan="2">In packs: {activity.unit_template_names.map((ut) => <span key={ut.id}><br />{ut}</span>)}</td>
    </tr>
  )

  return (
    <span>
      <tr className="ut-activity-row">
        {expandOrCollapseButton()}
        <td className="ut-activity-name-col">{activity.name}</td>
        <td className="ut-activity-flag-col">{activity.data && activity.data["flag"]}</td>
        <td className="ut-activity-readability-col">{activity.readability_grade_level}</td>
        <td className="ut-activity-ccss-col">{activity.standard && activity.standard.name}</td>
        <td className="ut-activity-cat-col">{activity.activity_category && activity.activity_category.name}</td>
        <td className="ut-activity-class-col">{activity.classification && activity.classification.key}</td>
      </tr>
      {showActivities && secondRow}
    </span>
  )
}

export default UnitTemplateActivityDataRow
