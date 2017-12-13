import React from 'react';
import { shallow } from 'enzyme';
import _ from 'underscore'

import RecommendationsComponent from '../recommendations.jsx'
import RecommendationsTableCell from '../recommendations_table_cell'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'

import {recommendationsObject} from '../../../../../../test_data/recommendations_activities'
import {students} from '../../../../../../test_data/students'

const recommendations = recommendationsObject.recommendations
const previouslyAssignedRecommendations = recommendationsObject.previouslyAssignedRecommendations
const params = {activityId: 413, classroomId: 1, unitId: 1}

describe('Recommendations Component', () => {

  it('renders a loading spinner if state.loading', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={params}
      />)
    expect(wrapper.find(LoadingSpinner)).toHaveLength(1)
  })

  it('renders as many RecommendationsTableCells as the number of students x number of activities', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={params}
      />)
    wrapper.setState({recommendations, students, selections: recommendations, loading: false})
    const numberOfRecommendationsTableCells = recommendations.length * students.length
    expect(wrapper.find(RecommendationsTableCell)).toHaveLength(numberOfRecommendationsTableCells)
  })

  describe('assignButton text', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={params}
      />)
      wrapper.setState({recommendations, students, selections: recommendations, loading: false})
      it('is Assigning... if this.state.assigning', () => {
        wrapper.setState({assigning: true})
        expect(wrapper.find('.recommendations-assign-button').first().text()).toBe('Assigning...')
      })
      it('is Assigned if this.state.assigned', () => {
        wrapper.setState({assigning: false, assigned: true})
        expect(wrapper.find('.recommendations-assign-button').first().text()).toBe('Assigned')
      })
      it('is Assign Activity Packs otherwise', () => {
        wrapper.setState({assigning: false, assigned: false})
        expect(wrapper.find('.recommendations-assign-button').first().text()).toBe('Assign Activity Packs')
      })
  })

  describe('calling setSelections', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={params}
      />)
    wrapper.setState({recommendations, students, previouslyAssignedRecommendations})
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

  describe('IMPORTANT: calling formatSelectionsForAssignment', () => {
    const wrapper = shallow(<RecommendationsComponent
      params={params}
    />)
    wrapper.setState({recommendations, students, previouslyAssignedRecommendations, selections: recommendations})
    it ('returns an object with key selections and value array of objects with ids and classrooms', () => {
      const selectionsArr = wrapper.state('selections').map(activityPack => ({
        id: activityPack.activity_pack_id,
        classrooms: [
          {
            id: params.classroomId,
            student_ids: activityPack.students,
          }
        ]
      }))
      const selectionsObj = {selections: selectionsArr}
      expect(_.isEqual(wrapper.instance().formatSelectionsForAssignment(), selectionsObj)).toBe(true)
    })
  })
})
