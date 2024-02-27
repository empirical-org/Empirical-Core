import * as React from 'react'

import { aggregateStudentData } from './helpers'

import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { diagnosticTypeDropdownOptions, hashPayload } from '../../shared'
import { requestPost } from '../../../../modules/request'

const STUDENTS_QUERY_KEY = "diagnostic-students"
const RECOMMENDATIONS_QUERY_KEY = "student-recommendations"
const PUSHER_EVENT_KEY = "admin-diagnostic-students-cached";
const DEFAULT_WIDTH = "140px"

const headers = [
  {
    name: 'Student Name',
    attribute: 'name',
    width: DEFAULT_WIDTH,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preToPostImprovedSkills',
    width: DEFAULT_WIDTH,
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
    width: DEFAULT_WIDTH,
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
    width: '146px',
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
    width: '134px',
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
    width: DEFAULT_WIDTH,
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
    width: '186px',
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
  passedRecommendationsData,
  passedStudentData,
  passedFormattedData
}) => {
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(diagnosticTypeDropdownOptions[0])
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [recommendationsData, setRecommendationsData] = React.useState<any>(passedRecommendationsData || []);
  const [studentData, setStudentData] = React.useState<any>(passedStudentData || []);
  const [formattedData, setFormattedData] = React.useState<any>(passedFormattedData || []);
  const [loading, setLoading] = React.useState<boolean>(!passedRecommendationsData && !passedStudentData && !passedFormattedData);

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!passedRecommendationsData && !passedStudentData && !passedFormattedData) {
      // this is for testing purposes; these values will always be null in a non-testing environment
      getData()
    }
  }, [searchCount, diagnosticTypeValue])

  React.useEffect(() => {
    if (studentData?.length && recommendationsData && Object.keys(recommendationsData).length) {
      const formattedData = aggregateStudentData(studentData, recommendationsData)
      setFormattedData(formattedData)
      setLoading(false)
    }
  }, [studentData, recommendationsData])


  React.useEffect(() => {
    if (!pusherMessage) return

    if (pusherMessage === getFilterHash(STUDENTS_QUERY_KEY)) {
      getStudentData()
    }
    if(pusherMessage === getFilterHash(RECOMMENDATIONS_QUERY_KEY)) {
      getRecommendationsData()
    }
  }, [pusherMessage])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

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

  function getData() {
    getRecommendationsData()
    getStudentData()
  }

  function getRecommendationsData() {
    setLoading(true)
    const searchParams = {
      query: RECOMMENDATIONS_QUERY_KEY,
      timeframe: selectedTimeframe,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades,
      diagnostic_id: diagnosticTypeValue.value
    }

    requestPost('/admin_diagnostic_students/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setRecommendationsData(results)
      }
    })
  }

  function getStudentData() {
    setLoading(true)
    const searchParams = {
      query: STUDENTS_QUERY_KEY,
      timeframe: selectedTimeframe,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades,
      diagnostic_id: diagnosticTypeValue.value
    }

    requestPost('/admin_diagnostic_students/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setStudentData(results)
      }
    })
  }

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function renderContent() {
    if (loading) {
      return <Spinner />
    }
    return (
      <DataTable
        className="growth-diagnostic-reports-by-student-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={formattedData}
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
