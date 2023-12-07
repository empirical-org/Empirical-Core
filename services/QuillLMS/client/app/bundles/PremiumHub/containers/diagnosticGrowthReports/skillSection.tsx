import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, diagnosticTypeDropdownOptions, groupByDropdownOptions, hashPayload } from '../../shared'
import { requestPost } from '../../../../modules/request'
import { aggregateSkillsData } from './helpers'

const QUERY_KEY = "admin-diagnostic-skills"
const PUSHER_EVENT_KEY = "admin-diagnostic-skills-cached";

const headers = [
  {
    name: 'Skill',
    attribute: 'skill',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preSkillScore',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre',
    secondaryTitle: 'Skill Score',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillScore',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post',
    secondaryTitle: 'Skill Score',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Growth Results',
    attribute: 'growthResults',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Students Improved Skill',
    attribute: 'studentsImprovedSkill',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsRecommendedPractice',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students',
    secondaryTitle: 'Recommended Practice',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsMaintainedProficiency',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students Maintained',
    secondaryTitle: 'Proficiency',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
]


export const SkillSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  pusherChannel,
  hasAdjustedFiltersFromDefault,
  handleSetNoDiagnosticDataAvailable,
  selectedDiagnosticId
}) => {

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(getInitialDiagnosticType())
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [skillsData, setSkillsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

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
    if (skillsData) {
      aggregateSkillsData({
        skillsData,
        setAggregatedData,
        hasAdjustedFiltersFromDefault,
        handleSetNoDiagnosticDataAvailable,
        setLoading
      })
    }
  }, [skillsData])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getData() {
    setLoading(true)
    const searchParams = {
      query: "diagnostic-skills",
      timeframe: selectedTimeframe,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades,
      group_by: groupByValue.value,
      diagnostic_id: diagnosticTypeValue.value
    }

    requestPost('/admin_diagnostic_skills/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        console.log("🚀 ~ file: skillSection.tsx:158 ~ requestPost ~ results:", results)
        setSkillsData(results)
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

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function handleGroupByOptionChange(option) {
    setGroupByValue(option)
  }

  function getInitialDiagnosticType() {
    if(selectedDiagnosticId) {
      return diagnosticTypeDropdownOptions.filter(diagnosticType => diagnosticType.value === selectedDiagnosticId)[0]
    }
    return diagnosticTypeDropdownOptions[0]
  }

  function renderContent() {
    if(loading) {
      return <Spinner />
    }
    return(
      <DataTable
        className="growth-diagnostic-reports-by-skill-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={aggregatedData}
      />
    )
  }

  return (
    <React.Fragment>
      <div className="dropdowns-container">
        <DropdownInput
          className="diagnostic-type-dropdown"
          handleChange={handleDiagnosticTypeOptionChange}
          isSearchable={true}
          label="Diagnostic:"
          options={diagnosticTypeDropdownOptions}
          value={diagnosticTypeValue}
        />
        <DropdownInput
          className="group-by-dropdown"
          handleChange={handleGroupByOptionChange}
          isSearchable={true}
          label="Group by:"
          options={groupByDropdownOptions}
          value={groupByValue}
        />
      </div>
      {renderContent()}
    </React.Fragment>
  )
}

export default SkillSection;
