import * as React from 'react'

import { results } from './test_data'
import { formatStudentData } from './helpers'

import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, diagnosticTypeDropdownOptions, hashPayload } from '../../shared'

const QUERY_KEY = "diagnostic-student"
const PUSHER_EVENT_KEY = "admin-diagnostic-student-cached";

const headers = [
  {
    name: 'Student Name',
    attribute: 'name',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preToPostImprovedSkills',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre to Post:',
    secondaryTitle: 'Improved Skills',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preQuestionsCorrect',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Questions Correct',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preSkillsProficient',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Skills Proficient',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'totalActivitiesAndTimespent',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Total Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postQuestionsCorrect',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post:',
    secondaryTitle: 'Questions Correct',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillsImprovedOrMaintained',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post: Skills',
    secondaryTitle: 'Improved Or Maintained',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
]


export const StudentSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  pusherChannel,
  selectedDiagnosticId,
  passedData
}) => {
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(getInitialDiagnosticType())
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [studentData, setStudentData] = React.useState<any>(passedData || []);
  console.log("🚀 ~ file: studentSection.tsx:103 ~ studentData:", studentData)
  const [loading, setLoading] = React.useState<boolean>(!passedData);

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!passedData) {
      // this is for testing purposes; this value will always be null in a non-testing environment
      getData()
    }
  }, [searchCount, diagnosticTypeValue])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (filtersMatchHash(pusherMessage)) getData()
  }, [pusherMessage])

  React.useEffect(() => {
    if (studentData) {
      setLoading(false)
    }
  }, [studentData])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function filtersMatchHash(hashMessage) {
    const filterTarget = [].concat(
      QUERY_KEY,
      parseInt(diagnosticTypeValue.value),
      selectedTimeframe,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds,
    )

    const filterHash = hashPayload(filterTarget)

    return hashMessage == filterHash
  }

  function getData() {
    setLoading(true)
    const formattedData = formatStudentData(results)
    setStudentData(formattedData)
  }

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function getInitialDiagnosticType() {
    if (selectedDiagnosticId) {
      return diagnosticTypeDropdownOptions.filter(diagnosticType => diagnosticType.value === selectedDiagnosticId)[0]
    }
    return diagnosticTypeDropdownOptions[0]
  }

  function renderContent() {
    if (loading) {
      return <Spinner />
    }
    return (
      <DataTable
        className="growth-diagnostic-reports-by-skill-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={studentData}
      />
    )
  }

  return (
    <React.Fragment>
      <DropdownInput
        className="diagnostic-type-dropdown"
        handleChange={handleDiagnosticTypeOptionChange}
        isSearchable={true}
        label="Diagnostic:"
        options={diagnosticTypeDropdownOptions}
        value={diagnosticTypeValue}
      />
      {renderContent()}
    </React.Fragment>
  )
}

export default StudentSection;
