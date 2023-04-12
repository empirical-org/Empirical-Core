import expect from 'expect';
import Immutable, { List, Map } from 'immutable';


describe('immutable', () => {

  describe('A list', () => {
    function addSession(currentState, session) {
      return currentState.push(session)
    }

    it ('is immutable', () => {
      let state = List.of({foo: 'bar'}, {fizz: "buzz"})
      let nextState = addSession(state, {fred: "barney"})

      expect(nextState).toEqual(List.of({foo: 'bar'}, {fizz: "buzz"}, {fred: "barney"}))
    })

  })

  describe('A map', () => {
    function addSession(currentState, session) {
      return currentState.mergeDeep(session)
    }

    function updateRelative(currentState, keys, data) {
      return currentState.merge(session)
    }


    it ('is immutable', () => {
      let state = Map({foo: 'bar'})
      let nextState = addSession(state, {fizz: "buzz"})

      expect(nextState).toEqual(Map({foo: 'bar', fizz: "buzz"}))
    })

    it("can handle deep merges", () => {
      const state = Immutable.fromJS({ryan: {
        mom: "Cathy",
        dad: "Paul"
      },
      donald: {
        mom: "Lorraine",
        dad: "Don"
      }})
      const test = Immutable.fromJS(state)
      // const nextState = addSession(state, {ryan: {mom: "Catherine"}})
      const nextState = state.setIn(["ryan", "mom"], "Catherine")
      expect(nextState).toEqual(Immutable.fromJS({ryan: {
        mom: "Catherine",
        dad: "Paul"
      },
      donald: {
        mom: "Lorraine",
        dad: "Don"
      }}))
    })

  })
})
