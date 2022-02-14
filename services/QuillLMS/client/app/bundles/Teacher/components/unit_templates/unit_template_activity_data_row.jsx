import * as React from 'react'


const UnitTemplateActivityDataRow = ({activity}) => {
  return (
    <tr>
      <td className="activity-name-col">{activity.name}</td>
      <td className="activity-flag-col">{activity.data && activity.data.flag}</td>
      <td className="activity-read-col">{activity.readability_grade_level}</td>
      <td className="activity-ccss-col">{activity.standard && activity.standard.name}</td>
      <td className="activity-cat-col">{activity.activity_category && activity.activity_category.name}</td>
      <td className="activity-class-col">{activity.activity_classification && activity.activity_classification.key}</td>
    </tr>
  )
}

export default UnitTemplateActivityDataRow
