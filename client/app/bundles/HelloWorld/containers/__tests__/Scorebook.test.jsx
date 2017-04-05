import React from 'react';
import { shallow } from 'enzyme';

import Scorebook from '../Scorebook.jsx'
import EmptyProgressReport from '../../components/scorebook/EmptyProgressReport'
import LoadingIndicator from '../../components/general_components/loading_indicator'
import StudentScores from '../../components/scorebook/student_scores'
import ScorebookFilters from '../../components/scorebook/scorebook_filters'
import ScoreLegend from '../../components/scorebook/score_legend'
import AppLegend from '../../components/scorebook/app_legend.jsx'

const classrooms = [{ name: 'A', id: 1}, { name: 'B', id: 2}, { name: 'C', id: 3}]
const units = [{ name: 'Something', id: 4}, { name: 'Someone', id: 5}, { name: 'Somewhere', id: 6}]
const scores = []

for (let x=0; x<30; x++) {
  scores.push({results: '', user: {id: x}})
}

const data = {
  teacher: { premium_state: 'trial' },
  is_last_page: false,
  classrooms,
  units,
  scores
}

describe('Scorebook component', () => {

  it('should render', () => {
    const wrapper = shallow(<Scorebook />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('if props.missing has a value', () => {
    const wrapper = shallow(<Scorebook missing={'students'}/>)

    it('renders EmptyProgressReport', () => {
      expect(wrapper.find(EmptyProgressReport).length).toEqual(1)
    })

    it('does not render LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(0)
    })

    it('does not render ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(0)
    })

    it('does not render ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(0)
    })

    it('does not render AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(0)
    })

    it('does not render StudentScores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(0)
    })


    // it('does not get rendered if it is not passed a value for missing', () => {
    //   const wrapper = shallow(<Scorebook missing={''}/>)
    //   expect(wrapper.find(EmptyProgressReport).length).toEqual(0)
    // })
  })

  describe('if state.loading is true', () => {
    const wrapper = shallow(<Scorebook/>)
    wrapper.setState({loading: true})

    it('renders LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(1)
    })

    it('renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1)
    })

    it('renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1)
    })

    it('renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1)
    })

    it('does not render StudentScores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(0)
    })
  })

  describe('if it gets data', () => {
    const wrapper = shallow(<Scorebook/>)
    wrapper.setState({currentPage: 1})
    wrapper.instance().displayData(data)

    it('does not render LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(0)
    })

    it('renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1)
    })

    it('renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1)
    })

    it('renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1)
    })

    it('renders as many StudentScores as there are state.scores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(wrapper.state('scores').length)
    })
  })

})
