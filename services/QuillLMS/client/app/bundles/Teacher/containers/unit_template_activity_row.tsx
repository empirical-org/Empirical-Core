import React from 'react'

// const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
//   if (draft) { return 'DRAFT' }
//   if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return }

//   const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
//   return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
// }


const UnitTemplateActivityRow = ({
  activities
}) => {

  const activitiesRows = activities.map((a) =>
  <tr>
    <td>{a.name}</td>
    <td>{a.data.flag}</td>
    <td>{a.readability_grade_level}</td>
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
