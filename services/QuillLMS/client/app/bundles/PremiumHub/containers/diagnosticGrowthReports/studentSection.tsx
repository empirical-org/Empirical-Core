import * as React from 'react'

import { aggregateStudentData, preToPostImprovedSkillsTooltipText, preQuestionsCorrectTooltipText, preSkillsProficientTooltipText, totalActivitiesAndTimespentTooltipText, postQuestionsCorrectTooltipText, postSkillsImprovedOrMaintainTooltipText, studentNameTooltipText } from './helpers'

import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { diagnosticTypeDropdownOptions, hashPayload } from '../../shared'
import { requestPost } from '../../../../modules/request'

const STUDENTS_QUERY_KEY = "diagnostic-students"
const RECOMMENDATIONS_QUERY_KEY = "student-recommendation"
const PUSHER_EVENT_KEY = "admin-diagnostic-students-cached";
const DEFAULT_WIDTH = "138px"
const BATCH_SIZE = 50

const headers = [
  {
    name: 'Student Name',
    attribute: 'name',
    sortAttribute: 'studentName',
    tooltipName: 'Student Name',
    tooltipDescription: studentNameTooltipText,
    width: DEFAULT_WIDTH,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preToPostImprovedSkills',
    sortAttribute: 'improvedSkills',
    width: DEFAULT_WIDTH,
    primaryTitle: 'Pre to Post:',
    secondaryTitle: 'Improved Skills',
    tooltipName: 'Pre to Post: Improved Skills',
    tooltipDescription: preToPostImprovedSkillsTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preQuestionsCorrect',
    sortAttribute: 'preQuestionsCorrectSortValue',
    width: DEFAULT_WIDTH,
    primaryTitle: 'Pre: Questions',
    secondaryTitle: 'Correct',
    tooltipName: 'Pre: Questions Correct',
    tooltipDescription: preQuestionsCorrectTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preSkillsProficient',
    sortAttribute: 'preSkillsProficientSortValue',
    width: '146px',
    primaryTitle: 'Pre: Skills',
    secondaryTitle: 'Proficient',
    tooltipName: 'Pre: Skills Proficient',
    tooltipDescription: preSkillsProficientTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'totalActivitiesAndTimespent',
    sortAttribute: 'totalActivities',
    width: '134px',
    primaryTitle: 'Total Activities',
    secondaryTitle: '& Time Spent',
    tooltipName: 'Total Activities & Time Spent',
    tooltipDescription: totalActivitiesAndTimespentTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'postQuestionsCorrect',
    sortAttribute: 'postQuestionsCorrectSortValue',
    width: DEFAULT_WIDTH,
    primaryTitle: 'Post: Questions',
    secondaryTitle: 'Correct',
    tooltipName: 'Post: Questions Correct',
    tooltipDescription: postQuestionsCorrectTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'postSkillsImprovedOrMaintained',
    sortAttribute: 'postSkillsImprovedOrMaintainedSortValue',
    width: '186px',
    primaryTitle: 'Post: Skills Improved',
    secondaryTitle: 'Or Maintained',
    tooltipName: 'Post: Skills Improved Or Maintained',
    tooltipDescription: postSkillsImprovedOrMaintainTooltipText,
    noTooltip: true,
    isSortable: true
  },
]

export const StudentSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  diagnosticTypeValue,
  pusherChannel,
  handleSetDiagnosticIdForStudentCount,
  handleSetSelectedDiagnosticType,
  passedStudentData,
  passedRecommendationsData,
  passedVisibleData
}) => {
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [recommendationsData, setRecommendationsData] = React.useState<any>(passedRecommendationsData || null);
  const [studentData, setStudentData] = React.useState<any>(passedStudentData || null);
  const [totalStudents, setTotalStudents] = React.useState<number>(null)
  const [visibleData, setVisibleData] = React.useState<any>(passedVisibleData || []);
  const [rowsToShow, setRowsToShow] = React.useState<number>(BATCH_SIZE);
  const [loading, setLoading] = React.useState<boolean>(!passedStudentData && !passedRecommendationsData && !passedVisibleData);

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    // this is for testing purposes; these values will always be null in a non-testing environment
    if (!passedVisibleData && diagnosticTypeValue) {
      handleSetDiagnosticIdForStudentCount(Number(diagnosticTypeValue.value))
      resetToDefault()
      getData()
    }
  }, [searchCount, diagnosticTypeValue])

  React.useEffect(() => {
    if(!studentData || !recommendationsData) { return }

    const formattedData = aggregateStudentData(studentData, recommendationsData)

    if(!formattedData) { return}

    updateVisibleData(formattedData);
    setLoading(false)
  }, [studentData, recommendationsData])


  React.useEffect(() => {
    if (!pusherMessage) return

    if (pusherMessage === getFilterHash(STUDENTS_QUERY_KEY, diagnosticTypeValue.value)) {
      getStudentData()
    }
    if(pusherMessage === getFilterHash(RECOMMENDATIONS_QUERY_KEY, diagnosticTypeValue.value)) {
      getRecommendationsData()
    }
  }, [pusherMessage])

  React.useEffect(() => {
    const formattedData = aggregateStudentData(studentData, recommendationsData)
    if(formattedData) {
      updateVisibleData(formattedData);
    }
  }, [rowsToShow])

  function resetToDefault() {
    setRecommendationsData(null)
    setStudentData(null)
    setVisibleData(passedVisibleData || [])
    setRowsToShow(BATCH_SIZE)
    setLoading(!passedVisibleData)
  }

  function updateVisibleData(data) {
    if(!totalStudents) {
      setTotalStudents(data.length)
    }
    const newDataToShow = data.slice(0, rowsToShow);
    setVisibleData(newDataToShow);
  }

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getFilterHash(queryKey, diagnosticId) {
    const filterTarget = [].concat(
      queryKey,
      parseInt(diagnosticId),
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
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setRecommendationsData(results)
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
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      if (rowsToShow > results.length) {
        setRowsToShow(results.length)
      }
      setStudentData(results)
    })
  }

  function handleDiagnosticTypeOptionChange(option: DropdownObjectInterface) {
    handleSetSelectedDiagnosticType(option)
  }

  function loadMoreRows() {
    const count = rowsToShow + BATCH_SIZE
    if(count > studentData.length) {
      setRowsToShow(studentData.length)
    } else {
      setRowsToShow((prevRows) => prevRows + BATCH_SIZE);
    }
  };

  function renderButtonContent() {
    const disabled = rowsToShow === studentData.length
    const disabledClass = disabled ? 'disabled contained' : 'outlined'
    return(
      <div className="load-more-button-container">
        <p>Displaying <strong>{`${rowsToShow} of ${studentData.length}`}</strong> students</p>
        <button className={`quill-button-archived small secondary focus-on-light ${disabledClass}`} disabled={disabled} onClick={loadMoreRows}>Load more</button>
      </div>
    )
  }

  function renderContent() {
    if (loading) {
      return <Spinner />
    }
    return (
      <div>
        <DataTable
          className="growth-diagnostic-reports-by-student-table reporting-format"
          emptyStateMessage={noResultsMessage('diagnostic')}
          headers={headers}
          rows={visibleData}
        />
        {renderButtonContent()}
      </div>
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
