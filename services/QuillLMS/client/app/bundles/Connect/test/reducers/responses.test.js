import expect from 'expect';
import 'whatwg-fetch';
import { deleteStatus, updateData, updateStatus } from '../../actions/responses';
import responsesReducer from '../../reducers/responsesReducer';

describe("The responses reducer", () => {
  const initialState = {
    data: {},
    status: {}
  }


  it("responds to the load action", () => {
    const action = updateStatus("question1", "LOADING");
    const newState = responsesReducer(initialState, action)
    expect(newState).toNotEqual(initialState);
  })

  it('responds to the delete action', () => {
    const action = deleteStatus("question1");
    let stateWithStatus = Object.assign({}, initialState, {status: {
      question1: "loaded"
    }});
    const newState = responsesReducer(stateWithStatus, action)
    expect(newState).toEqual(initialState)
  })

  it('can update question data', () => {
    const action = updateData("question1", {resp1: {text: "Foobar"}})
    const newState = responsesReducer(initialState, action)
    const expectedState = {
      data: {
        "question1": {
          resp1: {
            text: "Foobar"
          }
        }
      },
      status: {}
    }
    expect(newState).toEqual(expectedState)
  })



})
