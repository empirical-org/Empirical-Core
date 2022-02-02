import reducer from '../../reducers/lessons.js';
import C from '../../constants.js'

describe('lessons readucer', () => {
  const initialReducerState = {
    hasreceiveddata: false,
    submittingnew: false,
    flag: 'alpha',
    states: {},
    data: {}
  }

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialReducerState)
  })


  it('should set flag', () => {
    expect(
      reducer(initialReducerState, {type: C.SET_LESSON_FLAG, flag: 'production'})
    ).toEqual( {
      hasreceiveddata: false,
      submittingnew: false,
      flag: 'production',
      states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
      data: {} // this will contain firebase data
    }
    )
  })
})
