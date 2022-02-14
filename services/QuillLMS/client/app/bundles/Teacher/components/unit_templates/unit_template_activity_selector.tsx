import * as React from 'react'


import UnitTemplateActivityDataRow from './unit_template_activity_data_row'

import Pagination from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/pagination'
import { lowerBound, upperBound, sortFunctions, } from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/shared'
import { requestGet, requestPost, requestDelete } from '../../../../modules/request/index'


const UnitTemplateActivitySelector = () => {

  const [activities, setActivities] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('')
  const [sort, setSort] = React.useState('default')
  const currentPageActivities = activities.slice(lowerBound(currentPage), upperBound(currentPage));

  React.useEffect(() => {
    if (loading) { getActivities() }
  }, []);

  function getActivities() {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
      }
    )
  }

  const tableHeaders = (
    <tr className="unit-template-activities-headers">
      <th className="name-col">Name</th>
      <th className="flag-col">Flag</th>
      <th className="readability-col">Readability</th>
      <th className="ccss-col">CCSS</th>
      <th className="concept-col">Concept</th>
      <th className="tool-col">Tool</th>
    </tr>
  )


  const activityRows = currentPageActivities.map((act) => {
    return (
      <UnitTemplateActivityDataRow
        activity={act}
        key={act.id}
      />
    )
  })

  return (
    <div className="unit-template-activities">
      <h4>All Activities</h4>
      <div className="unit-template-activities-table">
        {tableHeaders}
        <table className="unit-template-activities-table-rows">
          {activityRows}
        </table>
      </div>
      <Pagination activities={activities} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default UnitTemplateActivitySelector
