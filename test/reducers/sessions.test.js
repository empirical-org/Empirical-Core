import sessionsReducer from '../../app/reducers/sessions'
import actions from '../../app/actions/sessions'
import expect from 'expect';

describe("The sessions reducer", () => {
  const initialState = {
    data: {}
  }

  it("can update a session", () => {
    const action = actions.update("session1", {foo: "bar"});
    const newState = sessionsReducer(initialState, action);
    console.log("newState", newState)
    expect(newState).toNotEqual(initialState);
  })

  it("can update a session by using the session key", () => {
    const action = actions.update("session1", {foo: "bar"});
    const newState = sessionsReducer(initialState, action);
    const expected = {
      data: {
        "session1": {foo: "bar"}
      }
    }
    console.log("newState", newState)
    expect(newState).toEqual(expected);
  })

  it('can delete a session by using the session key', () => {
    const action = actions.delete("session1")
    const currentState = {
      data: {
        "session1": {foo: "bar"}
      }
    }
    const newState = sessionsReducer(currentState, action)
    const expected = {
      data: {
      }
    }
    expect(newState).toEqual(expected)

  })
})
