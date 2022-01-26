import React, {useState} from 'react'

import UnitTemplateActivityRow from './unit_template_activity_row';
import { FlagDropdown } from '../../Shared/index';

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
  activities,
  unit_template_category,
  unitTemplate,
  updateUnitTemplate
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

  const handleSelectFlag = (e) => {
    let newUnitTemplate = unitTemplate
    newUnitTemplate.flag = e.target.value
    updateUnitTemplate(newUnitTemplate)
  }

  const handleRemoveActivity = (act_id) => {
    let newUnitTemplate = unitTemplate
    let activityIds = unitTemplate.activities.map((a) => a.id)
    activityIds.splice(activityIds.indexOf(act_id), 1)
    newUnitTemplate.activity_ids = activityIds
    updateUnitTemplate(newUnitTemplate)
  }

  return (
    <div>
      <tr className="blog-post-row unit-template-row" onClick={showHideActivitiesRow}>
        <td className="name-col">{name}</td>
        <td className="flag-col"><FlagDropdown flag={flag} handleFlagChange={handleSelectFlag} isLessons={false} /></td>
        <td className="diagnostics-col">{diagnostic_names.map((d) => (<div key={d}>{d}</div>))}</td>
        <td className="category-col">{unit_template_category && unit_template_category.name}</td>
        <td>{<a href={`${process.env.DEFAULT_URL}/assign/featured-activity-packs/${id}`} target="_blank">preview</a>}</td>
        <td className="edit-col">{<a href={`${process.env.DEFAULT_URL}/cms/unit_templates/${id}/edit`} target="_blank">edit</a>}</td>
        <td className="delete-col"><button className="delete-unit-template" onClick={deleteUnitTemplate} type="button">delete</button></td>
      </tr>

      {showActivities ? <UnitTemplateActivityRow unit_template_id={id} activities={activities} handleRemove={handleRemoveActivity}/> : ''}


    </div>
  )
}

export default UnitTemplateRow
