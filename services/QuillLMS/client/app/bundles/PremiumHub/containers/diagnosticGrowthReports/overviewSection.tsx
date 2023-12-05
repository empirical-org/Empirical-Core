import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { groupByDropdownOptions, hashPayload } from '../../shared'
import { requestPost, } from '../../../../modules/request';
import { aggregateOverviewData, averageActivitiesAndTimeSpentTooltipText, completedActivitiesTooltipText, diagnosticNameTooltipText, overallSkillGrowthTooltipText, postDiagnosticCompletedTooltipText, preDiagnosticCompletedTooltipText } from './helpers';

const QUERY_KEY = "admin-diagnostic-overview"
const PUSHER_EVENT_KEY = "admin-diagnostic-overview-cached";
const DIAGNOSTIC_NAME = 'Diagnostic Name'
const PRE_DIAGNOSTIC_COMPLETED = 'Pre Diagnostic Completed'
const COMPLETED_ACTIVITIES = 'Completed Activities'
const OVERALL_SKILL_GROWTH = 'Overall Skill Growth'

const headers = [
  {
    name: DIAGNOSTIC_NAME,
    attribute: 'name',
    width: '200px',
    tooltipName: DIAGNOSTIC_NAME,
    tooltipDescription: diagnosticNameTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: PRE_DIAGNOSTIC_COMPLETED,
    attribute: 'preDiagnosticCompleted',
    width: '200px',
    tooltipName: PRE_DIAGNOSTIC_COMPLETED,
    tooltipDescription: preDiagnosticCompletedTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: COMPLETED_ACTIVITIES,
    attribute: 'studentsCompletedPractice',
    width: '200px',
    tooltipName: COMPLETED_ACTIVITIES,
    tooltipDescription: completedActivitiesTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    width: '200px',
    primaryTitle: 'Average Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: 'Average Activities & Time Spent',
    tooltipDescription: averageActivitiesAndTimeSpentTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postDiagnosticCompleted',
    width: '200px',
    primaryTitle: 'Post Diagnostic',
    secondaryTitle: 'Completed',
    tooltipName: 'Post Diagnostic Completed',
    tooltipDescription: postDiagnosticCompletedTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: OVERALL_SKILL_GROWTH,
    attribute: 'overallSkillGrowth',
    width: '130px',
    tooltipName: OVERALL_SKILL_GROWTH,
    tooltipDescription: overallSkillGrowthTooltipText,
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
  pusherChannel,
  hasAdjustedFiltersFromDefault,
  handleSetNoDiagnosticData
}) => {

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])
  const [loading, setLoading] = React.useState<boolean>(true);
  const [preDiagnosticAssignedData, setPreDiagnosticAssignedData] = React.useState<any>(null);
  const [postDiagnosticAssignedData, setPostDiagnosticAssignedData] = React.useState<any>(null);
  const [preDiagnosticCompletedData, setPreDiagnosticCompletedData] = React.useState<any>(null);
  const [postDiagnosticCompletedData, setPostDiagnosticCompletedData] = React.useState<any>(null);
  const [recommendationsData, setRecommendationsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>([]);
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    getData()
  }, [searchCount, groupByValue])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (filtersMatchHash(pusherMessage)) getData()
  }, [pusherMessage])

  React.useEffect(() => {
    if (preDiagnosticAssignedData && postDiagnosticAssignedData && preDiagnosticCompletedData && postDiagnosticCompletedData && recommendationsData) {
      aggregateOverviewData({
        preDiagnosticAssignedData,
        postDiagnosticAssignedData,
        preDiagnosticCompletedData,
        postDiagnosticCompletedData,
        recommendationsData,
        setAggregatedData,
        hasAdjustedFiltersFromDefault,
        handleSetNoDiagnosticData,
        setLoading
      })
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
    setLoading(true)
    getPreDiagnosticAssignedData()
    getPreDiagnosticCompletedData()
    getPostDiagnosticAssignedData()
    getPostDiagnosticCompletedData()
    getRecommendationsData()
  }

  function getPreDiagnosticAssignedData () {
    const searchParams = getSearchParams("pre-diagnostic-assigned")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setPreDiagnosticAssignedData(results)
      }
    })
  }

  function getPostDiagnosticAssignedData() {
    const searchParams = getSearchParams("post-diagnostic-assigned")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setPostDiagnosticAssignedData(results)
      }
    })
  }

  function getPreDiagnosticCompletedData() {
    const searchParams = getSearchParams("pre-diagnostic-completed")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setPreDiagnosticCompletedData(results)
      }
    })
  }

  function getPostDiagnosticCompletedData() {
    const searchParams = getSearchParams("post-diagnostic-completed")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setPostDiagnosticCompletedData(results)
      }
    })
  }

  function getRecommendationsData() {
    const searchParams = getSearchParams("recommendations")

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setRecommendationsData(results)
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
