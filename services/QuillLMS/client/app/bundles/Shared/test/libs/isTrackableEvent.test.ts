import * as expect from 'expect'
import { isTrackableStudentEvent, UserIdsForEvent } from '../../../Shared'

describe('#isTrackableStudentEvent', () => {
  const idData: UserIdsForEvent = { teacherId: null, studentId: null }
  it('returns false if both ID values are not present', () => {
    expect(isTrackableStudentEvent(idData)).toEqual(false)
  });

  it('returns false if student ID is not present', () => {
    idData.teacherId = 1
    expect(isTrackableStudentEvent(idData)).toEqual(false)
  });

  it('returns false if teacher ID is not present', () => {
    idData.teacherId = null
    idData.studentId = 2
    expect(isTrackableStudentEvent(idData)).toEqual(false)
  })
  it('returns true if both ID values are present', () => {
    idData.teacherId = 1
    idData.studentId = 2
    expect(isTrackableStudentEvent(idData)).toEqual(true)
  })
});
