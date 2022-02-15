import * as React from 'react'
import request from 'request';

import UnitTemplateActivityDataRow from './unit_template_activity_data_row'

import Pagination from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/pagination'
import { lowerBound, upperBound, sortFunctions, } from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/shared'
import { requestGet, requestPost, requestDelete } from '../../../../modules/request/index'

const ACTIVITIES_URL = `http://localhost:5000/activities/index_with_unit_templates`

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
    request.get({
      url: ACTIVITIES_URL,
    }, (e, r, body) => {
      if (e || r.statusCode !== 200) {
        setLoading(false)
      } else {
        const data = JSON.parse(body);
        setLoading(false)
        setActivities(data.activities);
      }
    })
  }

  const tableHeaders = (
    <tr className="ut-activities-headers">
      <th className="ut-break">&nbsp;</th>
      <th className="ut-name-col">Name</th>
      <th className="ut-flag-col">Flag</th>
      <th className="ut-readability-col">Readability</th>
      <th className="ut-ccss-col">CCSS</th>
      <th className="ut-concept-col">Concept</th>
      <th className="ut-tool-col">Tool</th>
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
          <tbody className="unit-template-activities-tbody">
            {activityRows}
          </tbody>
        </table>
      </div>
      <Pagination activities={activities} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default UnitTemplateActivitySelector
