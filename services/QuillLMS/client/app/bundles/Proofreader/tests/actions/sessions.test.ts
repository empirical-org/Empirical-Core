import * as sessionActions from '../../actions/session'
import { SessionApi } from '../../lib/sessions_api'
import { mockDispatch as dispatch } from '../__mocks__/dispatch'

describe('Session actions', () => {

  describe('setSessionReducerToSavedSession', () => {
    it('should call Session.get and setSessionReducer', async () => {
      const MOCK_PASSAGE = "test passage"
      const MOCK_SESSION_ID = "id"
      const sessionApiGet= Promise.resolve({"passage": MOCK_PASSAGE})
      const apiSpy = jest.spyOn(SessionApi, 'get').mockImplementation(() => sessionApiGet);
      const actionsSpy = jest.spyOn(sessionActions, "setSessionReducer").mockImplementation(() => Promise.resolve());
      dispatch(sessionActions.setSessionReducerToSavedSession(MOCK_SESSION_ID, false))
      expect(apiSpy).toHaveBeenCalledWith(MOCK_SESSION_ID)
      await sessionApiGet
      expect(actionsSpy).toHaveBeenCalledWith(MOCK_PASSAGE)
    })
  })

  describe('updateSessionOnFirebase', () => {
    it('should call Session.update and setSessionReducerToSavedSession', async () => {
      const MOCK_PASSAGE = "test passage"
      const MOCK_SESSION_ID = "id"
      const sessionApiUpdate= Promise.resolve({"passage": MOCK_PASSAGE})
      const apiSpy = jest.spyOn(SessionApi, 'update').mockImplementation(() => sessionApiUpdate);
      const actionsSpy = jest.spyOn(sessionActions, "setSessionReducerToSavedSession").mockImplementation(() => Promise.resolve());
      dispatch(sessionActions.updateSessionOnFirebase(MOCK_SESSION_ID, { passage: null, timeTracking: {} }, null))
      expect(apiSpy).toHaveBeenCalledWith(MOCK_SESSION_ID, { passage: null, timeTracking: {} })
      await sessionApiUpdate
      expect(actionsSpy).toHaveBeenCalledWith(MOCK_SESSION_ID)
    })
  })

})
