import React, {useState} from 'react'

import UnitTemplateActivityRow from './unit_template_activity_row';

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
  diagnostic_names,
  order_number,
  handleDelete,
  activities
}) => {
  const [showActivities, setShowActivities] = useState(false);
  // const handleClickStar = () => onClickStar(id)
  const deleteUnitTemplate = () => {
    var confirm = window.confirm('are you sure you want to delete ' + name + '?');
    if (confirm) {
      handleDelete(id);
    }
  }

  const showHideActivitiesRow = () => {
    setShowActivities(!showActivities)
  }

  return (
    <div>
      <tr className="unit-template-row" onClick={showHideActivitiesRow}>
        <td>{name}</td>
        <td>{flag}</td>
        <td>{diagnostic_names.map((d) => (<div key={d}>{d}</div>))}</td>
        <td>{<a href={`${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`} target="_blank">preview</a>}</td>
        <td>{<a href={`${process.env.DEFAULT_URL}/cms/unit_templates/${id}/edit`} target="_blank">edit</a>}</td>
        <td><button onClick={deleteUnitTemplate} type="button">delete</button></td>
      </tr>

      {showActivities ? <UnitTemplateActivityRow activities={activities} /> : ''}


    </div>
  )
}

export default UnitTemplateRow
