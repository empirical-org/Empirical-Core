import * as moment from 'moment';
import * as React from 'react';
import { CSVLink } from 'react-csv';

import { requestPost, } from '../../../modules/request';
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual';
import { DataTable, Spinner, informationIcon, smallWhiteCheckIcon } from '../../Shared';
import { filterObjectArrayByAttributes } from '../../Shared/libs/filterFunctions';

const STANDARD_WIDTH = "152px";
const STUDENT_NAME = "Student Name";
const STUDENT_EMAIL = "Student Email";
const SCHOOL = "School";
const GRADE = "Grade";
const TEACHER = "Teacher";
const CLASS = "Class";
const COMPLETED_DATE = "Completed Date";
const ACTIVITY_PACK = "Activity Pack";
const ACTIVITY = "Activity";
const TOOL = "Tool";
const SCORE = "Score";
const STANDARD = "Standard";
const TIME_SPENT = "Time Spent";

const PUSHER_EVENT_KEY = "data-export-cached";

interface DataExportTableAndFieldsProps {
  customTimeframeEnd: string;
  customTimeframeStart: string;
  pusherChannel?: any;
  queryKey: string;
  searchCount: number;
  selectedClassroomIds: number[];
  selectedGrades: string[];
  selectedSchoolIds: number[];
  selectedTeacherIds: number[];
  selectedTimeframe: string;
  openMobileFilterMenu: Function;
}

export const DataExportTableAndFields = ({ openMobileFilterMenu, queryKey, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, pusherChannel }: DataExportTableAndFieldsProps) => {
  const [showStudentEmail, setShowStudentEmail] = React.useState<boolean>(true);
  const [showSchool, setShowSchool] = React.useState<boolean>(true);
  const [showGrade, setShowGrade] = React.useState<boolean>(true);
  const [showTeacher, setShowTeacher] = React.useState<boolean>(true);
  const [showClass, setShowClass] = React.useState<boolean>(true);
  const [showCompletedDate, setShowCompletedDate] = React.useState<boolean>(true);
  const [showActivityPack, setShowActivityPack] = React.useState<boolean>(true);
  const [showActivity, setShowActivity] = React.useState<boolean>(true);
  const [showTool, setShowTool] = React.useState<boolean>(true);
  const [showScore, setShowScore] = React.useState<boolean>(true);
  const [showStandard, setShowStandard] = React.useState<boolean>(true);
  const [showTimeSpent, setShowTimeSpent] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<any>(null);

  const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

  const fields = {
    [STUDENT_NAME]: {
      dataTableField: { name: STUDENT_NAME, attribute: "student_name", width: STANDARD_WIDTH },
      checked: true
    },
    [STUDENT_EMAIL]: {
      dataTableField: { name: STUDENT_EMAIL, attribute: "student_email", width: STANDARD_WIDTH },
      setterFunction: setShowStudentEmail,
      checked: showStudentEmail
    },
    [COMPLETED_DATE]: {
      dataTableField: { name: COMPLETED_DATE, attribute: "completed_at", width: STANDARD_WIDTH },
      setterFunction: setShowCompletedDate,
      checked: showCompletedDate
    },
    [ACTIVITY]: {
      dataTableField: { name: ACTIVITY, attribute: "activity_name", width: STANDARD_WIDTH },
      setterFunction: setShowActivity,
      checked: showActivity
    },
    [ACTIVITY_PACK]: {
      dataTableField: { name: ACTIVITY_PACK, attribute: "activity_pack", width: STANDARD_WIDTH },
      setterFunction: setShowActivityPack,
      checked: showActivityPack
    },
    [SCORE]: {
      dataTableField: { name: SCORE, attribute: "score", width: STANDARD_WIDTH },
      setterFunction: setShowScore,
      checked: showScore
    },
    [TIME_SPENT]: {
      dataTableField: { name: `${TIME_SPENT} (Mins)`, attribute: "timespent", width: STANDARD_WIDTH },
      setterFunction: setShowTimeSpent,
      checked: showTimeSpent
    },
    [STANDARD]: {
      dataTableField: { name: STANDARD, attribute: "standard", width: STANDARD_WIDTH },
      setterFunction: setShowStandard,
      checked: showStandard
    },
    [TOOL]: {
      dataTableField: { name: TOOL, attribute: "tool", width: STANDARD_WIDTH },
      setterFunction: setShowTool,
      checked: showTool
    },
    [SCHOOL]: {
      dataTableField: { name: SCHOOL, attribute: "school_name", width: STANDARD_WIDTH },
      setterFunction: setShowSchool,
      checked: showSchool
    },
    [GRADE]: {
      dataTableField: { name: GRADE, attribute: "classroom_grade", width: STANDARD_WIDTH },
      setterFunction: setShowGrade,
      checked: showGrade
    },
    [TEACHER]: {
      dataTableField: { name: TEACHER, attribute: "teacher_name", width: STANDARD_WIDTH },
      setterFunction: setShowTeacher,
      checked: showTeacher
    },
    [CLASS]: {
      dataTableField: { name: CLASS, attribute: "classroom_name", width: STANDARD_WIDTH },
      setterFunction: setShowClass,
      checked: showClass
    },
  };

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    initializePusher()
    getData()
  }, [searchCount])

  const searchParams = {
    query: queryKey,
    timeframe: selectedTimeframe,
    timeframe_custom_start: customTimeframeStart,
    timeframe_custom_end: customTimeframeEnd,
    school_ids: selectedSchoolIds,
    teacher_ids: selectedTeacherIds,
    classroom_ids: selectedClassroomIds,
    grades: selectedGrades
  }

  function getData() {
    requestPost('/snapshots/data_export', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        // We consider `null` to be a lack of data, so if the result is `[]` we need to explicitly `setData(null)`
        const data = results.length > 0 ? results : null
        const formattedData = formatData(data)
        setData(formattedData)
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      const queryKeysAreEqual = message.query === queryKey
      const timeframesAreEqual = message.timeframe === selectedTimeframe
      const schoolIdsAreEqual = unorderedArraysAreEqual(message.school_ids, selectedSchoolIds)
      const teacherIdsAreEqual = unorderedArraysAreEqual(message.teacher_ids, selectedTeacherIds)
      const classroomIdsAreEqual = unorderedArraysAreEqual(message.classroom_ids, selectedClassroomIds)
      const gradesAreEqual = unorderedArraysAreEqual(message.grades, selectedGrades.map(grade => String(grade))) || (!message.grades && !selectedGrades.length)

      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual && teacherIdsAreEqual && classroomIdsAreEqual) {
        getData()
      }
    });
  };

  function getTimeSpentInMinutes(seconds: number) {
    if (!seconds) {
      return 'N/A';
    }
    if (seconds < 60) {
      return `<1`;
    }
    if (seconds >= 60 && seconds < 120) {
      return '1';
    }
    return `${Math.floor((seconds % 3600) / 60)}`;
  }

  function formatData(data) {
    if(!data) { return null }

    return data.map((entry, index) => {
      const formattedEntry = {...entry}
      const score = Math.round(parseFloat(entry.score) * 100);
      const percentage = isNaN(score) || score < 0 ? 'N/A' : score + '%';

      formattedEntry.id = index
      formattedEntry.completed_at = moment(entry.completed_at).format("MM/DD/YYYY");
      formattedEntry.timespent = getTimeSpentInMinutes(entry.timespent)
      formattedEntry.score = percentage
      return formattedEntry
    })
  }

  function toggleCheckbox(e) {
    e.preventDefault();
    const fieldLabel = e.currentTarget.id;
    const checked = fields[fieldLabel].checked;
    const setterFunction = fields[fieldLabel].setterFunction
    setterFunction(!checked);
  }

  function renderCheckboxes() {
    return Object.keys(fields).map((fieldLabel, i) => {
      // skip Student Name because we want this field to always be present
      if (i === 0) { return }

      let checkbox = (
        <div className="checkbox-container">
          <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" id={fieldLabel} onClick={toggleCheckbox} type="button" />
          <label htmlFor={fieldLabel}>{fieldLabel}</label>
        </div>
      )
      if (fields[fieldLabel].checked) {
        checkbox = (
          <div className="checkbox-container">
            <button aria-label="Checked checkbox" className="quill-checkbox selected" id={fieldLabel} onClick={toggleCheckbox} type="button">
              <img alt="Checked checkbox" src={smallWhiteCheckIcon.src} />
            </button>
            <label htmlFor={fieldLabel}>{fieldLabel}</label>
          </div>
        )
      }
      return checkbox;
    })
  }

  function filterByHeaders() {
    const headers = getHeaders();
    return filterObjectArrayByAttributes(data, headers);
  }

  function getHeaders() {
    return Object.keys(fields).flatMap(fieldLabel => {
      const headerSelected = fields[fieldLabel].checked
      if (!headerSelected) { return [] }
      return fields[fieldLabel].dataTableField;
    })
  }

  function paramsToQueryString(){
    // {"query":"data-export","timeframe":"this-school-year","school_ids":[88016],
    // "teacher_ids":null,"classroom_ids":null,"grades":null}

    return ''
  }

  function handleClickDownloadReport() {
    if(true) { // TODO FIX
      return window.open(`/snapshots/data_export.csv${paramsToQueryString()}`);
    }
    alert('Downloadable reports are a Premium feature. You can visit Quill.org/premium to upgrade now!');
  }

  return(
    <React.Fragment>
      <div className="header">
        <h1>Data Export</h1>
        <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report old</button>
        {data && <CSVLink
          data={filterByHeaders()}
          filename="data_export.csv"
          target="_blank"
        >
          <button className="quill-button contained primary medium focus-on-light" type="button">Download Report</button>
        </CSVLink> }
      </div>

      <div className="filter-button-container">
        <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
          <img alt="Filter icon" src={filterIconSrc} />
          Filters
        </button>
      </div>

      <div className="data-export-container">


        <section className="fields-section">
          <h3>Fields</h3>
          <div className="fields-container">
            {renderCheckboxes()}
          </div>
        </section>
        <section className="preview-section">
          <h3>Preview</h3>
          <div className="preview-disclaimer-container">
            <img alt={informationIcon.alt} src={informationIcon.src} />
            <p>This preview is limited to the first 10 results. Your download will include all activities.</p>
          </div>
        </section>
        {loading && <Spinner />}
        {!loading && <DataTable
          className="data-export-table"
          defaultSortAttribute="completed_at"
          defaultSortDirection="desc"
          emptyStateMessage="There are no activities available for the filters selected. Try modifying or removing a filter to see results."
          headers={getHeaders()}
          rows={data || []}
        />}
      </div>
    </React.Fragment>
  )
}

export default DataExportTableAndFields;
