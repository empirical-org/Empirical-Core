import * as React from 'react'
import * as moment from 'moment'

import { findDifferences } from './findDifferences'

const generateKey = (studentKey, index) => `${studentKey}#${index}`
const responseSpan = (text) => <span dangerouslySetInnerHTML={{__html: text}} />

const RetryCell = ({ index, handleRetryClick, splitSubmissions, }) => {
  const newSplitSubmissions = [...splitSubmissions]
  newSplitSubmissions[index] = ''
  const handleClick = () => handleRetryClick(newSplitSubmissions)
  return (<button className="interactive-wrapper" onClick={handleClick} type="button">
    <i className="fa fa-refresh student-retry-question" />
  </button>)
}

const CheckboxCell = ({ determineCheckbox, selectedSubmissions, currentSlide, index, studentKey, studentName, handleClickCheckbox, }) => {
  const key = generateKey(studentKey, index)
  const handleClick = (e) => handleClickCheckbox(e, key)
  const checked: boolean = selectedSubmissions && selectedSubmissions[currentSlide] ? selectedSubmissions[currentSlide][key] : false
  const checkbox = determineCheckbox(checked)
  return (<React.Fragment>
    <input
      defaultChecked={checked}
      id={key}
      name={studentName}
      onClick={handleClick}
      type="checkbox"
    />
    <label aria-checked={checked} htmlFor={key}>
      {checkbox}
    </label>
  </React.Fragment>)
}

const AnswerNumber = ({ selectedSubmissions, selectedSubmissionOrder, currentSlide, studentKey, index, }) => {
  const key = generateKey(studentKey, index)
  const checked: boolean = selectedSubmissions && selectedSubmissions[currentSlide] ? selectedSubmissions[currentSlide][key] : false
  const studentNumber: number | null = checked === true && selectedSubmissionOrder && selectedSubmissionOrder[currentSlide] ? selectedSubmissionOrder[currentSlide].indexOf(key) + 1 : null
  const studentNumberClassName: string = checked === true ? 'answer-number' : ''
  return <span className={`answer-number-container ${studentNumberClassName}`}>{studentNumber}</span>
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
  renderFlag,
  calculateElapsedMilliseconds
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

  const handleClickCheckbox = (e, key) => toggleSelected(e, currentSlide, key)

  const text: any = submissions[currentSlide][studentKey].data
  const submissionText = showDifferences ? findDifferences(text, lessonPrompt) : text;
  const submittedTimestamp: string = submissions[currentSlide][studentKey].timestamp
  const elapsedTime: any = formatElapsedTime(moment(submittedTimestamp))
  const studentName: string = students[studentKey]

  const splitSubmissions = submissionText instanceof Object ? Object.keys(submissionText).map(k => submissionText[k]) : [submissionText]
  const rows = splitSubmissions.filter(s => s.length).map((sub, subIndex) => {
    let className = ''
    className+= subIndex === 0 ? ' first' : ''
    className+= subIndex === splitSubmissions.length - 1 ? ' last' : ''
    let studentNameCellContent, flagCellContent, elapsedTimeCellContent
    let responseCellContent: JSX.Element|Array<JSX.Element> = responseSpan(sub)
    let checkboxCellContent: JSX.Element|Array<JSX.Element> = (<CheckboxCell currentSlide={currentSlide} determineCheckbox={determineCheckbox} handleClickCheckbox={handleClickCheckbox} index={subIndex} selectedSubmissions={selectedSubmissions} studentKey={studentKey} studentName={studentName} />)
    let retryCellContent: JSX.Element|Array<JSX.Element> = (<RetryCell handleRetryClick={handleRetryClick} index={subIndex} splitSubmissions={splitSubmissions} />)
    let answerNumberContent: JSX.Element = (<AnswerNumber currentSlide={currentSlide} index={subIndex} selectedSubmissionOrder={selectedSubmissionOrder} selectedSubmissions={selectedSubmissions} studentKey={studentKey} />)
    if (subIndex === 0) {
      studentNameCellContent = studentName
      flagCellContent = renderFlag(studentKey)
      elapsedTimeCellContent = elapsedTime
    }
    return (<tr className={className} key={`${index}-${subIndex}`}>
      <td>{studentNameCellContent}</td>
      <td>{flagCellContent}</td>
      <td>{responseCellContent}</td>
      <td>{elapsedTimeCellContent}</td>
      <td>{checkboxCellContent}</td>
      <td>{answerNumberContent}</td>
      <td className="retry-question-cell">{retryCellContent}</td>
    </tr>)
  })

  return rows
}

export default ReviewStudentRow
