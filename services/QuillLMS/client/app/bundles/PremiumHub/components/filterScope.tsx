import * as React from 'react'

import { requestPost } from '../../../modules/request'
import { FETCH_ACTION, RESET_ACTION, hashPayload } from '../shared'

const PUSHER_EVENT_KEY = "admin-diagnostic-students-cached";
const FILTER_SCOPE_QUERY_KEY = 'filter-scope'

const FilterScope = ({
  selectedGrades,
  hasAdjustedFiltersFromDefault,
  selectedTimeframe,
  selectedSchools,
  selectedTeachers,
  selectedClassrooms,
  diagnosticIdForStudentCount,
  pusherChannel,
  filterScopeAction,
  handleSetApplyFilterButtonClicked,
  handleSetFilterScopeAction
}) => {

  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [loadingStudentCount, setLoadingStudentCount] = React.useState<boolean>(true)
  const [totalStudentCountForFilters, setTotalStudentCountForFilters] = React.useState<Number>(null)
  const [totalStudentMatchesForFilters, setTotalStudentMatchesForFilters] = React.useState<Number>(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (pusherMessage === getFilterHash({ key: FILTER_SCOPE_QUERY_KEY, id: diagnosticIdForStudentCount, withFilters: false })) {
      getStudentCountData()
    }
    if (pusherMessage === getFilterHash({ key: FILTER_SCOPE_QUERY_KEY, id: diagnosticIdForStudentCount, withFilters: true })) {
      getStudentCountData()
    }
  }, [pusherMessage])

  React.useEffect(() => {
    if (diagnosticIdForStudentCount && hasAdjustedFiltersFromDefault && !totalStudentCountForFilters && !totalStudentMatchesForFilters) {
      getStudentCountData()
    }
  }, [diagnosticIdForStudentCount])

  React.useEffect(() => {
    if (totalStudentCountForFilters && totalStudentMatchesForFilters) {
      setLoadingStudentCount(false)
      handleSetApplyFilterButtonClicked(true)
    }
  }, [totalStudentCountForFilters, totalStudentMatchesForFilters])

  React.useEffect(() => {
    handleSetApplyFilterButtonClicked(false)
    resetCounts()
  }, [diagnosticIdForStudentCount])

  React.useEffect(() => {
    if(filterScopeAction === FETCH_ACTION) {
      getStudentCountData()
    }
    if(filterScopeAction === RESET_ACTION) {
      resetCounts()
    }
  }, [filterScopeAction])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getFilterHash({ key, id, withFilters }) {
    const filterTarget = [].concat(
      key,
      id,
      selectedTimeframe.value,
      withFilters ? selectedSchools.map(s => s.id) : null,
      withFilters ? selectedGrades.map(g => g.value) : null,
      withFilters ? selectedTeachers.map(t => t.id) : null,
      withFilters ? selectedClassrooms.map(c => c.id) : null,
    )
    return hashPayload(filterTarget)
  }

  function resetCounts() {
    setTotalStudentMatchesForFilters(null)
    setTotalStudentCountForFilters(null)
    handleSetFilterScopeAction('')
  }

  function getStudentCountData() {
    resetCounts()
    setLoadingStudentCount(true)
    getStudentCountDataForFilters(false)
    getStudentCountDataForFilters(true)
  }

  function getStudentCountDataForFilters(withFilters) {
    const searchParams = {
      query: FILTER_SCOPE_QUERY_KEY,
      timeframe: selectedTimeframe.value,
      school_ids: withFilters ? selectedSchools.map(s => s.id) : null,
      teacher_ids: withFilters ? selectedTeachers.map(t => t.id) : null,
      classroom_ids: withFilters ? selectedClassrooms.map(c => c.id) : null,
      grades: withFilters ? selectedGrades.map(g => g.value) : null,
      diagnostic_id: diagnosticIdForStudentCount
    }

    requestPost('/admin_diagnostic_students/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results } = body
      const { count } = results
      if (withFilters) {
        setTotalStudentMatchesForFilters(count)
      } else {
        setTotalStudentCountForFilters(count)
      }
    })
  }

  const shouldDisplayStudentCount = !loadingStudentCount && totalStudentCountForFilters && totalStudentMatchesForFilters

  if(!shouldDisplayStudentCount) { return null }

  const matchText = totalStudentMatchesForFilters === 1 ? 'match' : 'matches'
  const totalText = totalStudentCountForFilters === 1 ? 'student' : 'students'
  return <p className="filters-student-count"><strong>{totalStudentMatchesForFilters}</strong> {matchText} from <strong>{totalStudentCountForFilters}</strong> {totalText}</p>

}

export default FilterScope
