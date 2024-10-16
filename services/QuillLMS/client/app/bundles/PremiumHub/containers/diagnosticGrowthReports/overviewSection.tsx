import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { SKILL, STUDENT, getDiagnosticTypeDropdownOptions, groupByDropdownOptions, hashPayload } from '../../shared'
import { requestPost, } from '../../../../modules/request';
import { aggregateOverviewData, averageActivitiesAndTimeSpentTooltipText, completedActivitiesTooltipText, diagnosticNameTooltipText, overallSkillGrowthTooltipText, postDiagnosticCompletedTooltipText, preDiagnosticCompletedTooltipText } from './helpers';

const PUSHER_EVENT_KEY = 'admin-diagnostic-overview-cached';
const PRE_DIAGNOSTIC_ASSIGNED_QUERYSTRING = 'pre-diagnostic-assigned'
const POST_DIAGNOSTIC_ASSIGNED_QUERYSTRING = 'post-diagnostic-assigned'
const PRE_DIAGNOSTIC_COMPLETED_QUERYSTRING = 'pre-diagnostic-completed'
const POST_DIAGNOSTIC_COMPLETED_QUERYSTRING = 'post-diagnostic-completed'
const RECOMMENDATIONS_QUERYSTRING = 'recommendations'
const DEFAULT_CELL_WIDTH = '170px'

const DIAGNOSTIC_NAME = 'Diagnostic Name'
const PRE_DIAGNOSTIC_COMPLETED = 'Pre Diagnostic Completed'
const COMPLETED_ACTIVITIES = 'Completed Activities'
const OVERALL_SKILL_GROWTH = 'Overall Skill Growth'

const headers = [
  {
    name: DIAGNOSTIC_NAME,
    attribute: 'name',
    sortAttribute: 'name',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: DIAGNOSTIC_NAME,
    tooltipDescription: diagnosticNameTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    primaryTitle: 'Pre Diagnostic',
    secondaryTitle: 'Completed',
    attribute: 'preDiagnosticCompleted',
    sortAttribute: 'preStudentsCompleted',
    width: '190px',
    tooltipName: PRE_DIAGNOSTIC_COMPLETED,
    tooltipDescription: preDiagnosticCompletedTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: COMPLETED_ACTIVITIES,
    attribute: 'studentsCompletedPractice',
    sortAttribute: 'completedPracticeCount',
    width: '180px',
    tooltipName: COMPLETED_ACTIVITIES,
    tooltipDescription: completedActivitiesTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    sortAttribute: 'averageActivitiesCount',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Average Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: 'Average Activities & Time Spent',
    tooltipDescription: averageActivitiesAndTimeSpentTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'postDiagnosticCompleted',
    sortAttribute: 'postStudentsCompleted',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post Diagnostic',
    secondaryTitle: 'Completed',
    tooltipName: 'Post Diagnostic Completed',
    tooltipDescription: postDiagnosticCompletedTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    sortAttribute: 'overallSkillGrowthSortValue',
    primaryTitle: 'Overall',
    secondaryTitle: 'Skill Growth',
    attribute: 'overallSkillGrowth',
    width: '164px',
    tooltipName: OVERALL_SKILL_GROWTH,
    tooltipDescription: overallSkillGrowthTooltipText,
    noTooltip: true,
    isSortable: true
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
  groupByValue,
  hasAdjustedFiltersFromDefault,
  handleSetNoDiagnosticDataAvailable,
  handleTabChangeFromDataChip,
  handleSetSelectedDiagnosticType,
  handleSetSelectedGroupByValue,
  handleSetDiagnosticIdForStudentCount,
  passedData
}) => {
  const [loading, setLoading] = React.useState<boolean>(!passedData);
  const [preDiagnosticAssignedData, setPreDiagnosticAssignedData] = React.useState<any>(null);
  const [postDiagnosticAssignedData, setPostDiagnosticAssignedData] = React.useState<any>(null);
  const [preDiagnosticCompletedData, setPreDiagnosticCompletedData] = React.useState<any>(null);
  const [postDiagnosticCompletedData, setPostDiagnosticCompletedData] = React.useState<any>(null);
  const [recommendationsData, setRecommendationsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>(passedData || []);
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)

  React.useEffect(() => {
    handleSetDiagnosticIdForStudentCount(null)
  }, [])

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    // this is for testing purposes; this value will always be null in a non-testing environment
    if (!passedData && groupByValue) {
      getData()
    }
  }, [searchCount, groupByValue])

  React.useEffect(() => {
    if (!pusherMessage) return

    switch (pusherMessage) {
      case getFilterHash(PRE_DIAGNOSTIC_ASSIGNED_QUERYSTRING):
        getPreDiagnosticAssignedData()
        break;
      case getFilterHash(PRE_DIAGNOSTIC_COMPLETED_QUERYSTRING):
        getPreDiagnosticCompletedData()
        break;
      case getFilterHash(POST_DIAGNOSTIC_ASSIGNED_QUERYSTRING):
        getPostDiagnosticAssignedData()
        break;
      case getFilterHash(POST_DIAGNOSTIC_COMPLETED_QUERYSTRING):
        getPostDiagnosticCompletedData()
        break;
      case getFilterHash(RECOMMENDATIONS_QUERYSTRING):
        getRecommendationsData()
        break;
    }
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
        handleSetNoDiagnosticDataAvailable,
        setLoading,
        handleGrowthChipClick,
        handlePreDiagnosticChipClick,
        groupByValue: groupByValue.value
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

  function getPreDiagnosticAssignedData() {
    setPreDiagnosticAssignedData(null)
    const searchParams = getSearchParams(PRE_DIAGNOSTIC_ASSIGNED_QUERYSTRING)

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setPreDiagnosticAssignedData(results)
    })
  }

  function getPostDiagnosticAssignedData() {
    setPostDiagnosticAssignedData(null)
    const searchParams = getSearchParams(POST_DIAGNOSTIC_ASSIGNED_QUERYSTRING)

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setPostDiagnosticAssignedData(results)
    })
  }

  function getPreDiagnosticCompletedData() {
    setPreDiagnosticCompletedData(null)
    const searchParams = getSearchParams(PRE_DIAGNOSTIC_COMPLETED_QUERYSTRING)

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setPreDiagnosticCompletedData(results)
    })
  }

  function getPostDiagnosticCompletedData() {
    setPostDiagnosticCompletedData(null)
    const searchParams = getSearchParams(POST_DIAGNOSTIC_COMPLETED_QUERYSTRING)

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setPostDiagnosticCompletedData(results)
    })
  }

  function getRecommendationsData() {
    setRecommendationsData(null)
    const searchParams = getSearchParams(RECOMMENDATIONS_QUERYSTRING)

    requestPost('/admin_diagnostic_reports/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setRecommendationsData(results)
    })
  }

  function getFilterHash(queryKey) {
    const filterTarget = [].concat(
      queryKey,
      selectedTimeframe,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds,
    )
    return hashPayload(filterTarget)
  }

  function handleFilterOptionChange(option) {
    handleSetSelectedGroupByValue(option)
  }

  function handlePreDiagnosticChipClick(id: number) {
    const diagnosticTypeDropdownOptions = getDiagnosticTypeDropdownOptions(selectedTimeframe)
    const diagnosticType = diagnosticTypeDropdownOptions.filter(diagnosticType => diagnosticType.value === id)[0]
    handleSetSelectedDiagnosticType(diagnosticType)
    handleTabChangeFromDataChip(STUDENT)
  }

  function handleGrowthChipClick(id: number) {
    const diagnosticTypeDropdownOptions = getDiagnosticTypeDropdownOptions(selectedTimeframe)
    const diagnosticType = diagnosticTypeDropdownOptions.filter(diagnosticType => diagnosticType.value === id)[0]
    handleSetSelectedDiagnosticType(diagnosticType)
    handleSetSelectedGroupByValue(groupByValue)
    handleTabChangeFromDataChip(SKILL)
  }

  function renderContent() {
    if (loading) {
      return <Spinner />
    }
    return (
      <DataTable
        className="growth-diagnostic-reports-overview-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={aggregatedData}
      />
    )
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
      {renderContent()}
    </React.Fragment>
  )
}

export default OverviewSection;
