import React from 'react'

// const featuredCellContent = ({ featuredOrderNumber, featuredBlogPostLimitReached, handleClickStar, draft, }) => {
//   if (draft) { return 'DRAFT' }
//   if (featuredBlogPostLimitReached && featuredOrderNumber === null) { return }

//   const star = featuredOrderNumber === null ? <i className="far fa-star" /> : <i className="fas fa-star" />
//   return <button className="interactive-wrapper" onClick={handleClickStar} type="button">{star}</button>
// }


const UnitTemplateRow = ({
  id,
  name,
  flag,
  diagnostics,
}) => {
  // const handleClickStar = () => onClickStar(id)

  return (<tr className="unit-template-row">
    <td>{name}</td>
    <td>{flag}</td>
    <td>{diagnostics.map((d) => (<div key={d}>{d}</div>))}</td>
    <td>{<a href={`${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`} target="_blank">preview</a>}</td>
    <td>{<a href={`${process.env.DEFAULT_URL}/cms/unit_templates/${id}/edit`} target="_blank">edit</a>}</td>
  </tr>)
}

export default UnitTemplateRow
