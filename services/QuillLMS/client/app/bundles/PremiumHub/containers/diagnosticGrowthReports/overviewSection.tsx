import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, getTimeInMinutesAndSeconds, groupByDropdownOptions, hashPayload } from '../../shared'
import { requestPost, } from '../../../../modules/request';

const QUERY_KEY = "admin-diagnostic-overview"
const PUSHER_EVENT_KEY = "admin-diagnostic-overview-cached";

const headers = [
  {
    name: 'Diagnostic Name',
    attribute: 'name',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Pre Diagnostic Completed',
    attribute: 'preDiagnosticCompleted',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Completed Activities',
    attribute: 'studentsCompletedPractice',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Average Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postDiagnosticCompleted',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post Diagnostic',
    secondaryTitle: 'Completed',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Overall Skill Growth',
    attribute: 'overallSkillGrowth',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  }
]


export const OverviewSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  pusherChannel
}) => {

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])
  const [loading, setLoading] = React.useState<boolean>(true);
  const [preDiagnosticAssignedData, setPreDiagnosticAssignedData] = React.useState<any>(null);
  const [postDiagnosticAssignedData, setPostDiagnosticAssignedData] = React.useState<any>(null);
  const [preDiagnosticCompletedData, setPreDiagnosticCompletedData] = React.useState<any>(null);
  const [postDiagnosticCompletedData, setPostDiagnosticCompletedData] = React.useState<any>(null);
  const [recommendationsData, setRecommendationsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>([]);
  const [pusherMessage, setPusherMessage] = React.useState<any>(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    getData()
  }, [searchCount])


  React.useEffect(() => {
    if (!pusherMessage) return

    if (filtersMatchHash(pusherMessage)) getData()
  }, [pusherMessage])

  React.useEffect(() => {
    if (preDiagnosticAssignedData && postDiagnosticAssignedData && preDiagnosticCompletedData && postDiagnosticCompletedData && recommendationsData) {
      aggregateData()
    }
  }, [preDiagnosticAssignedData, postDiagnosticAssignedData, preDiagnosticCompletedData, postDiagnosticCompletedData, recommendationsData])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getSearchParams(queryString) {
    return {
      query: queryString,
      timeframe: selectedTimeframe,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades,
      group_by: groupByValue.value
    }
  }

  function getData() {
    getPreDiagnosticAssignedData()
    getPreDiagnosticCompletedData()
    getPostDiagnosticAssignedData()
    getPostDiagnosticCompletedData()
    getRecommendationsData()
  }

  function aggregateData() {
    const preDiagnosticAssignedDataHash = {}
    const postDiagnosticAssignedDataHash = {}
    const preDiagnosticCompletedDataHash = {}
    const postDiagnosticCompletedDataHash = {}
    const recommendationsDataHash = {}
    const aggregateRowsData = {}

    const combinedData = preDiagnosticAssignedData.map(entry => {
      const { diagnostic_id, diagnostic_name, aggregate_rows, pre_students_assigned } = entry
      preDiagnosticAssignedDataHash[diagnostic_id] = { pre_students_assigned }
      // aggregateRowsData[diagnostic_id] = aggregate_rows
      return {
        id: diagnostic_id,
        name: diagnostic_name,
        preDiagnosticCompleted: null,
        studentsCompletedPractice: null,
        averageActivitiesAndTimeSpent: null,
        postDiagnosticCompleted: null,
        overallSkillGrowth: null,
        aggregate_rows: null
      }
    })

    postDiagnosticAssignedData.map(entry => {
      const { diagnostic_id, aggregate_rows, post_students_assigned } = entry
      postDiagnosticAssignedDataHash[diagnostic_id] = { post_students_assigned }
      // aggregateRowsData[diagnostic_id] = aggregate_rows
    })
    preDiagnosticCompletedData.map(entry => {
      const { diagnostic_id, aggregate_rows, pre_average_score, pre_students_completed } = entry
      preDiagnosticCompletedDataHash[diagnostic_id] = {
        pre_average_score,
        pre_students_completed
      }
      // aggregateRowsData[diagnostic_id] = aggregate_rows
    })
    postDiagnosticCompletedData.map(entry => {
      const { diagnostic_id, aggregate_rows, post_average_score, post_students_completed } = entry
      postDiagnosticCompletedDataHash[diagnostic_id] = {
        post_average_score,
        post_students_completed
      }
      // aggregateRowsData[diagnostic_id] = aggregate_rows
    })
    recommendationsData.map(entry => {
      const { diagnostic_id, aggregate_rows, average_practice_activities_count, average_time_spent_seconds, students_completed_practice } = entry
      recommendationsDataHash[diagnostic_id] = {
        average_practice_activities_count,
        average_time_spent_seconds,
        students_completed_practice
      }
      // aggregateRowsData[diagnostic_id] = aggregate_rows
    })

    combinedData.forEach(entry => {
      const { id } = entry
      if(!preDiagnosticAssignedDataHash[id]?.pre_students_assigned) { return }
      const preStudentsAssigned = preDiagnosticAssignedDataHash[id]?.pre_students_assigned
      const preStudentsCompleted = preDiagnosticCompletedDataHash[id]?.pre_students_completed
      const postStudentsAssigned = postDiagnosticAssignedDataHash[id]?.post_students_assigned
      const postStudentsCompleted = postDiagnosticCompletedDataHash[id]?.post_students_completed
      const studentsCompletedPractice = recommendationsDataHash[id]?.students_completed_practice
      const averageActivitiesCount = recommendationsDataHash[id]?.average_practice_activities_count
      const averageTimespent = recommendationsDataHash[id]?.average_time_spent_seconds
      entry.preDiagnosticCompleted = `${preStudentsCompleted || 0} of ${preStudentsAssigned || 0} Students`
      entry.studentsCompletedPractice = `${studentsCompletedPractice || 0} Students`
      entry.averageActivitiesAndTimeSpent = `${Math.round(averageActivitiesCount) || 0} Activities (${getTimeInMinutesAndSeconds(averageTimespent)})`
      entry.postDiagnosticCompleted = `${postStudentsCompleted || 0} of ${postStudentsAssigned || 0} Students`
    })
    setAggregatedData(combinedData)
  }

  function getPreDiagnosticAssignedData () {
    const searchParams = getSearchParams("pre-diagnostic-assigned")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        setPreDiagnosticAssignedData(results)
        setLoading(false)
      }
    })
  }

  function getPostDiagnosticAssignedData() {
    const searchParams = getSearchParams("post-diagnostic-assigned")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        setPostDiagnosticAssignedData(results)
        setLoading(false)
      }
    })
  }

  function getPreDiagnosticCompletedData() {
    const searchParams = getSearchParams("pre-diagnostic-completed")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        setPreDiagnosticCompletedData(results)
        setLoading(false)
      }
    })
  }

  function getPostDiagnosticCompletedData() {
    const searchParams = getSearchParams("post-diagnostic-completed")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        setPostDiagnosticCompletedData(results)
        setLoading(false)
      }
    })
  }

  function getRecommendationsData() {
    const searchParams = getSearchParams("recommendations")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        setRecommendationsData(results)
        setLoading(false)
      }
    })
  }

  function filtersMatchHash(hashMessage) {
    const filterTarget = [].concat(
      QUERY_KEY,
      selectedTimeframe,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds
    )

    const filterHash = hashPayload(filterTarget)

    return hashMessage == filterHash
  }

  function handleFilterOptionChange(option) {
    setGroupByValue(option)
  }

  return (
    <React.Fragment>
      <DropdownInput
        className="group-by-dropdown"
        handleChange={handleFilterOptionChange}
        isSearchable={true}
        label="Group by:"
        options={groupByDropdownOptions}
        value={groupByValue}
      />
      {loading && <Spinner />}
      {!loading && <DataTable
        className="growth-diagnostic-reports-overview-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={aggregatedData}
      />}
    </React.Fragment>
  )
}

export default OverviewSection;
