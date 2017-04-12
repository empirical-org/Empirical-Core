import React from 'react';
import { shallow } from 'enzyme';
import _ from 'underscore'
import RecommendationsComponent from '../recommendations.jsx'
import {recommendationsObject} from '../../../../../../test_data/recommendations_activities'
import {students} from '../../../../../../test_data/students'

const recommendations = recommendationsObject.recommendations
const previouslyAssignedRecommendations = recommendationsObject.previouslyAssignedRecommendations
describe('Recommendations Component', () => {

  const wrapper = shallow(
    <RecommendationsComponent
      params={{activityId: 413, classroomId: 1, unitId: 1}}
    />)

  wrapper.setState({recommendations, students, previouslyAssignedRecommendations})

  describe('calling setSelections', () => {
    wrapper.instance().setSelections(previouslyAssignedRecommendations)
    it('assigns state.selections to an array of activities, each with an array of student ids concatenated from state.previouslyAssignedRecommendations and state.recommendations', () => {
      const selections = wrapper.state('recommendations').map((recommendation, i) => {
				const prevAssigned = previouslyAssignedRecommendations[i]
				const allStudents = _.uniq(recommendation.students.concat(prevAssigned.students))
				return {
					activity_pack_id: recommendation.activity_pack_id,
					name: recommendation.name,
					students: allStudents
				}
			})
      expect(_.isEqual(wrapper.state('selections'), selections)).toBe(true)
    })
  })
})
