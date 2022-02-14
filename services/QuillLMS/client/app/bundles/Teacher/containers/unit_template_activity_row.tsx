import React from 'react'


const UnitTemplateActivityRow = ({
  activities,
  handleRemove
}) => {

  const activitiesRows = activities.map(
    (a) => (
      <tr className="unit-template-activity-row" key={a.id}>
        <td className="activity-name-col">{a.name}</td>
        <td className="activity-flag-col">{a.data && a.data.flag}</td>
        <td className="activity-read-col">{a.readability_grade_level}</td>
        <td className="activity-ccss-col">{a.standard && a.standard.name}</td>
        <td className="activity-cat-col">{a.activity_category && a.activity_category.name}</td>
        <td className="activity-class-col">{a.classification.name}</td>
        <td className="activity-remove-col"><button onClick={() => handleRemove(a.id)} type="button">remove</button></td>
      </tr>
    )
  )

  return (
    <table className="unit-template-activity-table">
      {activities.length > 0 && <tr className="unit-template-activity-headers">
        <th className="activity-name-col">name</th>
        <th className="activity-flag-col">flag</th>
        <th className="activity-read-col">readability</th>
        <th className="activity-ccss-col">CCSS</th>
        <th className="activity-cat-col">concept</th>
        <th className="activity-class-col">tool</th>
      </tr>}
      {activitiesRows}
    </table>
  )
}

export default UnitTemplateActivityRow
