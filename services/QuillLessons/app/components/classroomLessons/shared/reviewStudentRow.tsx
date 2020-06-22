import * as React from 'react'
import * as moment from 'moment'

import { findDifferences } from './findDifferences'

const calculateElapsedMilliseconds = (submittedTimestamp, timestamps, currentSlide): number => {
  return submittedTimestamp.diff(moment(timestamps[currentSlide]))
}

const responseSpan = (text) => <span dangerouslySetInnerHTML={{__html: text}} />

const RetryCell = ({ index, handleRetryClick, submissionText, }) => {
  const splitSubmissions = submissionText.split('; ')
  splitSubmissions[index] = ''
  const newSubmissionText = splitSubmissions.join('; ')
  const handleClick = () => handleRetryClick(newSubmissionText)
  return (<button className="interactive-wrapper" onClick={handleClick}>
    <i className="fa fa-refresh student-retry-question" />
  </button>)
}

const ReviewStudentRow = ({
  determineCheckbox,
  selectedSubmissions,
  submissions,
  currentSlide,
  students,
  selectedSubmissionOrder,
  slideType,
  showDifferences,
  lessonPrompt,
  toggleSelected,
  studentKey,
  index,
  timestamps,
  retryQuestionForStudent,
  renderFlag
}) => {

  const formatElapsedTime = (submittedTimestamp) => {
    const elapsedMilliseconds: number = calculateElapsedMilliseconds(submittedTimestamp, timestamps, currentSlide)
    const elapsedMinutes: number = moment.duration(elapsedMilliseconds).minutes()
    const elapsedSeconds: number = moment.duration(elapsedMilliseconds).seconds()
    const formattedMinutes: string|number = elapsedMinutes > 9 ? elapsedMinutes : 0 + elapsedMinutes.toString()
    const formattedSeconds: string|number = elapsedSeconds > 9 ? elapsedSeconds : 0 + elapsedSeconds.toString()
    return formattedMinutes + ':' + formattedSeconds
  }

  const handleRetryClick = (newSubmission) => retryQuestionForStudent(studentKey, newSubmission)

  const handleClickCheckbox = (e) => toggleSelected(e, currentSlide, studentKey)

  const text: any = submissions[currentSlide][studentKey].data
  const submissionText = showDifferences ? findDifferences(text, lessonPrompt) : text;
  const submittedTimestamp: string = submissions[currentSlide][studentKey].timestamp
  const elapsedTime: any = formatElapsedTime(moment(submittedTimestamp))
  const checked: boolean = selectedSubmissions && selectedSubmissions[currentSlide] ? selectedSubmissions[currentSlide][studentKey] : false
  const checkbox = determineCheckbox(checked)
  const studentNumber: number | null = checked === true && selectedSubmissionOrder && selectedSubmissionOrder[currentSlide] ? selectedSubmissionOrder[currentSlide].indexOf(studentKey) + 1 : null
  const studentNumberClassName: string = checked === true ? 'answer-number' : ''
  const studentName: string = students[studentKey]

  let responseCellContent: JSX.Element|Array<JSX.Element> = responseSpan(submissionText)
  let checkboxCellContent: JSX.Element|Array<JSX.Element> = (
    <React.Fragment>
      <input
        defaultChecked={checked}
        id={studentName}
        name={studentName}
        type="checkbox"
      />
      <label htmlFor={studentName} onClick={handleClickCheckbox} role="checkbox">
        {checkbox}
      </label>
    </React.Fragment>
  )
  let retryCellContent: JSX.Element|Array<JSX.Element> = (<RetryCell index={0} handleRetryClick={handleRetryClick} submissionText={submissionText} />)

  if (slideType === "CL-FL") {
    const splitSubmissions = submissionText.split('; ')
    responseCellContent = []
    checkboxCellContent = []
    retryCellContent = []
    splitSubmissions.forEach((sub, index) => {
      responseCellContent.push(responseSpan(sub))
      retryCellContent.push(<RetryCell index={index} handleRetryClick={handleRetryClick} submissionText={submissionText} />)
    })
  }

  return (<tr key={index}>
    <td>{studentName}</td>
    <td>{renderFlag(studentKey)}</td>
    <td>{responseCellContent}</td>
    <td>{elapsedTime}</td>
    <td>{checkboxCellContent}</td>
    <td><span className={`answer-number-container ${studentNumberClassName}`}>{studentNumber}</span></td>
    <td className="retry-question-cell">{retryCellContent}</td>
  </tr>)
}

export default ReviewStudentRow
