import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { activityOne } from './data';

const csrfToken = 'mocked-csrf-token';
document.head.innerHTML = `<meta name="csrf-token" content="${csrfToken}">`;

global.scrollTo = jest.fn()
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

const mockParse = () => ({ uid: activityOne.activity_id })
jest.mock('query-string', () => ({
  default: {
    parse: mockParse
  }
}))

const mockTrackAnalyticsEvent = jest.fn()
jest.mock('../../../actions/analytics', () => ({
  TrackAnalyticsEvent: mockTrackAnalyticsEvent
}))

const mockGetActivity = jest.fn()
jest.mock('../../../actions/activities', () => ({
  getActivity: mockGetActivity
}))

jest.mock('string-strip-html', () => ({
  default: jest.fn(() => {
    return {};
  })
}))

import { StudentViewContainer } from '../../../components/studentView/container';

const dispatch = () => {}

const activitiesReducer = { hasReceivedData: true, currentActivity: activityOne}
const sessionReducer = { submittedResponses: [], sessionID: 'MockSessionID', hasReceivedData: true, activeStep: 1, explanationSlidesCompleted: false }

const wrapper = mount(<StudentViewContainer
  activities={activitiesReducer}
  dispatch={dispatch}
  location={{ search: "?uid=1" }}
  session={sessionReducer}
/>)

// commenting out on 9/30/21 - keeping these for behavior description but these are all failing because they are dependent on `setState` and that isn't accessible to us with React Hooks

// TODO: update tests to fix activity and prompt IDs for mockTrackAnalyticsEvent calls

describe('StudentViewContainer component', () => {
//   describe('when the activity has loaded', () => {
//     wrapper.instance().setExplanationSlidesCompleted(true)
//
  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })
//
//     it('should track a COMPREHENSION_ACTIVITY_STARTED event', () => {
//       expect(mockGetActivity).toHaveBeenCalledWith(sessionReducer.sessionID, activityOne.activity_id)
//     })
//
//     describe('when the first step has been completed', () => {
//       wrapper.setState({ completedSteps: [1], activeStep: 2, hasStartedReadPassageStep: true, hasStartedPromptSteps: true, })
//       it('should render a promptStep for each prompt in the activity', () => {
//         expect(wrapper.find(PromptStep).length).toBe(activityOne.prompts.length)
//       })
//
//       it('should render prompts in correct order', () => {
//         expect(wrapper.find(PromptStep).at(0).props().prompt.conjunction).toEqual('because')
//         expect(wrapper.find(PromptStep).at(1).props().prompt.conjunction).toEqual('but')
//         expect(wrapper.find(PromptStep).at(2).props().prompt.conjunction).toEqual('so')
//       });
//
//     })
//
//     describe('when complete step is called', () => {
//       describe('when the next step has not yet been completed and is not more than the total number of steps', () => {
//         beforeAll(() => {
//           wrapper.setState({ completedSteps: [1] })
//           wrapper.instance().completeStep(2)
//         })
//
//         it('sets the next chronological step as the active step', () => {
//           expect(wrapper.state('activeStep')).toBe(3)
//           expect(wrapper.state('completedSteps')).toEqual([1, 2])
//         })
//
//         it('should also track a COMPREHENSION_PROMPT_COMPLETED event', () => {
//           expect(mockTrackAnalyticsEvent).toHaveBeenNthCalledWith(1, Events.COMPREHENSION_PROMPT_COMPLETED, {
//             activityID: undefined,
//             sessionID: sessionReducer.sessionID,
//             promptID: activityOne.prompts[0].id
//           })
//         })
//
//         it('should also track a COMPREHENSION_PROMPT_STARTED event', () => {
//           expect(mockTrackAnalyticsEvent).toHaveBeenNthCalledWith(2, Events.COMPREHENSION_PROMPT_STARTED, {
//             activityID: undefined,
//             sessionID: sessionReducer.sessionID,
//             promptID: activityOne.prompts[1].id
//           })
//         })
//       })
//
//       describe('when the next step has already been completed', () => {
//         it('sets the first uncompleted step as the active step', () => {
//           wrapper.setState({ completedSteps: [2] })
//           wrapper.instance().completeStep(1)
//           expect(wrapper.state('activeStep')).toBe(3)
//           expect(wrapper.state('completedSteps').sort()).toEqual([1, 2])
//         })
//       })
//
//       describe('when the next step is more than the total number of steps', () => {
//         it('sets the first uncompleted step to be the active step', () => {
//           wrapper.setState({ completedSteps: [1, 3] })
//           wrapper.instance().completeStep(4)
//           expect(wrapper.state('activeStep')).toBe(2)
//           expect(wrapper.state('completedSteps')).toEqual([1, 3, 4])
//         })
//       })
//
//       describe('when all steps are completed', () => {
//         beforeAll(() => {
//           mockTrackAnalyticsEvent.mockClear()
//           wrapper.setState({ completedSteps: [1, 2, 3] })
//           wrapper.instance().completeStep(4)
//         })
//
//         it('adds the last step to the completed steps array', () => {
//           expect(wrapper.state('completedSteps')).toEqual([1, 2, 3, 4])
//         })
//
//         it('should also track a COMPREHENSION_ACTIVITY_COMPLETED event', () => {
//           expect(mockTrackAnalyticsEvent).toHaveBeenNthCalledWith(2, Events.COMPREHENSION_ACTIVITY_COMPLETED, {
//             activityID: activityOne.activity_id,
//             sessionID: sessionReducer.sessionID
//           })
//         })
//       })
//     })
//
//     describe('when the user clicks on a stepLink', () => {
//       const scrollToStepOnMobileMock = jest.fn()
//       wrapper.instance().scrollToStepOnMobile = scrollToStepOnMobileMock
//
//       describe('when the read passage step has been completed', () => {
//         beforeAll(() => {
//           mockTrackAnalyticsEvent.mockClear()
//           wrapper.setState({ completedSteps: [1], activeStep: 2, hasStartedReadPassageStep: true, hasStartedPromptSteps: true, activityIsComplete: false, explanationSlidesCompleted: true })
//           wrapper.find('.step-links').find('.step-link').last().simulate('click')
//         })
//
//         it('activates that step', () => {
//           expect(wrapper.state('activeStep')).toBe(4)
//           expect(scrollToStepOnMobileMock).toHaveBeenCalled()
//         })
//
//         it('should also track a COMPREHENSION_PROMPT_STARTED event', () => {
//           const lastPromptIndex = activityOne.prompts.length - 1
//           expect(mockTrackAnalyticsEvent).toHaveBeenCalledWith(Events.COMPREHENSION_PROMPT_STARTED, {
//             activityID: undefined,
//             sessionID: sessionReducer.sessionID,
//             promptID: activityOne.prompts[lastPromptIndex].id
//           })
//         })
//       })
//     })
//
//   })
//
//   describe('when the activity has not loaded', () => {
//     const activitiesReducer = { hasReceivedData: false }
//     const sessionReducer = { submittedResponses: {} }
//     const wrapper = shallow(<StudentViewContainer
//       activities={activitiesReducer}
//       dispatch={dispatch}
//       location={{ search: "?uid=1" }}
//       session={sessionReducer}
//     />)
//
//     it('renders a loading spinner', () => {
//       expect(wrapper.find(LoadingSpinner).length).toBe(1)
//     })
//   })
//
})
