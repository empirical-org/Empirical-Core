import React from 'react'

// const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
//   if (draft) { return 'DRAFT' }
//   if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return }

//   const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
//   return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
// }

const UnitTemplateActivityRow = ({
  unit_template_id,
  activities,
  handleRemove
}) => {

  const activitiesRows = activities.map((a) =>
  <tr key={a.id}>
    <td>{a.name}</td>
    <td>{a.data && a.data.flag}</td>
    <td>{a.readability_grade_level}</td>
    <td>{a.standard && a.standard.standard_level && a.standard.standard_level.name}</td>
    <td>{a.activity_category && a.activity_category.name}</td>
    <td>{a.classification.name}</td>
    <td><button onClick={() => handleRemove(a.id)} type="button">remove</button></td>
  </tr>
  )

  return (
    <table>
    <tr>
      <th>name</th>
      <th>flag</th>
      <th>readability</th>
      <th>CCSS</th>
      <th>concept</th>
      <th>tool</th>
    </tr>

    {activitiesRows}
  </table>
  )
}

export default UnitTemplateActivityRow
