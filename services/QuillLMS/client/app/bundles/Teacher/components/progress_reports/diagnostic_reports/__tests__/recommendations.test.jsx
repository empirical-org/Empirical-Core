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
const routeParams = { activityId: 413, classroomId: 1, unitId: 1 }

describe('Recommendations Component', () => {

  it('renders a loading spinner if state.loading', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={routeParams}
        routeParams={routeParams}
      />)
    expect(wrapper.find(LoadingSpinner)).toHaveLength(1)
  })

  describe('if none of the students have completed the activity', () => {
    const studentsWhoDidNotCompleteDiagnostic = students.map(s => {
      const newS = {...s}
      newS.completed = false
      return newS
    })
    const wrapper = shallow(
      <RecommendationsComponent
        params={routeParams}
        routeParams={routeParams}
      />)
    wrapper.setState({recommendations, students: studentsWhoDidNotCompleteDiagnostic, selections: recommendations, loading: false})

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('if all of the students have completed the activity', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={routeParams}
        routeParams={routeParams}
      />)
    wrapper.setState({recommendations, students, selections: recommendations, loading: false})

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('renders as many RecommendationsTableCells as the number of students x number of activities', () => {
      const numberOfRecommendationsTableCells = recommendations.length * students.length
      expect(wrapper.find(RecommendationsTableCell)).toHaveLength(numberOfRecommendationsTableCells)
    })

  })

  describe('assignButton text', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={routeParams}
        routeParams={routeParams}
      />)
      wrapper.setState({recommendations, students, selections: recommendations, loading: false})
      it('is Assigning... if this.state.assigning', () => {
        wrapper.setState({assigning: true})
        expect(wrapper.find('.quill-button.contained').first().text()).toBe('Assigning...')
      })
      it('is Assigned if this.state.assigned', () => {
        wrapper.setState({assigning: false, assigned: true})
        expect(wrapper.find('.quill-button.contained').first().text()).toBe('Assigned')
      })
      it('is Assign Activity Packs otherwise', () => {
        wrapper.setState({assigning: false, assigned: false})
        expect(wrapper.find('.quill-button.contained').first().text()).toBe('Assign Activity Packs')
      })
  })

  describe('calling setSelections', () => {
    const wrapper = shallow(
      <RecommendationsComponent
        params={routeParams}
        routeParams={routeParams}
      />)
    wrapper.setState({recommendations, students, previouslyAssignedRecommendations})
    wrapper.instance().setSelections(previouslyAssignedRecommendations)
    it('assigns state.selections to an array of activities which is identical to the recommended activities', () => {
      const selections = wrapper.state('recommendations').map(recommendation => {
				return recommendation
			})
      expect(_.isEqual(wrapper.state('selections'), selections)).toBe(true)
    })
  })

  describe('IMPORTANT: calling formatSelectionsForAssignment', () => {
    const wrapper = shallow(<RecommendationsComponent
      params={routeParams}
      routeParams={routeParams}
    />)
    wrapper.setState({recommendations, students, previouslyAssignedRecommendations, selections: recommendations})
    it ('returns an object with key selections and value array of objects with ids and classrooms', () => {
      const selectionsArr = wrapper.state('selections').map((activityPack, index) => {
        const students = _.uniq(activityPack.students.concat(wrapper.state('previouslyAssignedRecommendations')[index].students))
          return {
            id: activityPack.activity_pack_id,
            classrooms: [
              {
                id: routeParams.classroomId,
                student_ids: students,
              }
            ]
          }
        })
      const selectionsObj = {selections: selectionsArr}
      expect(_.isEqual(wrapper.instance().formatSelectionsForAssignment(), selectionsObj)).toBe(true)
    })
  })
})
