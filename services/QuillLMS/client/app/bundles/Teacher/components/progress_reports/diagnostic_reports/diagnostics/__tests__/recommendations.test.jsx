import React from 'react'
import { mount } from 'enzyme'
import * as $ from 'jquery'

import {
  dummyMatchData,
  dummyLocationData,
  independentRecommendationsNoStudentData,
  previouslyAssignedIndependentRecommendationsNoStudentData,
  lessonRecommendationsNoStudentData,
  independentRecommendationsWithStudentData,
  previouslyAssignedIndependentRecommendationsWithStudentData,
  previouslyAssignedLessonRecommendationsWithStudentData,
  lessonRecommendationsWithStudentData,
} from './test_data'

import { Recommendations, } from '../recommendations'

jest.mock('qs', () => ({
    default: {
      parse: jest.fn(() => ({}))
    }
  })
)

describe('Recommendations component', () => {
  it('should render when there is no student data', () => {
    const wrapper = mount(<Recommendations
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedIndependentRecommendations={independentRecommendationsNoStudentData}
      passedLessonRecommendations={lessonRecommendationsNoStudentData}
      passedPreviouslyAssignedLessonRecommendations={[]}
      passedPreviouslyAssignedRecommendation={previouslyAssignedIndependentRecommendationsNoStudentData}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is student data', () => {
    const wrapper = mount(<Recommendations
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedIndependentRecommendations={independentRecommendationsWithStudentData}
      passedLessonRecommendations={lessonRecommendationsWithStudentData}
      passedPreviouslyAssignedLessonRecommendations={previouslyAssignedLessonRecommendationsWithStudentData}
      passedPreviouslyAssignedRecommendations={previouslyAssignedIndependentRecommendationsWithStudentData}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
