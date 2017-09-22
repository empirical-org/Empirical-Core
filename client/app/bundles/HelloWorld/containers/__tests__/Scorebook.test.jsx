import React from 'react';
import { shallow, mount } from 'enzyme';

import moment from 'moment';

import Scorebook from '../Scorebook.jsx';
import EmptyProgressReport from '../../components/shared/EmptyProgressReport';
import LoadingIndicator from '../../components/shared/loading_indicator';
import StudentScores from '../../components/scorebook/student_scores';
import ScorebookFilters from '../../components/scorebook/scorebook_filters';
import ScoreLegend from '../../components/scorebook/score_legend';
import AppLegend from '../../components/scorebook/app_legend.jsx';

const resolvedScores = new Map();
resolvedScores.set('441555', { name: 'blah blah', scores: [{ caId: '341930', userId: '441555', updated: '2016-09-16 15:39:00.775325', name: 'America Used to be a Different Place', percentage: '1', activity_classification_id: '1', }], }, );
const classrooms = [{ name: 'A', id: 1, }, { name: 'B', id: 2, }, { name: 'C', id: 3, }];
const units = [{ name: 'Something', id: 4, }, { name: 'Someone', id: 5, }, { name: 'Somewhere', id: 6, }];
const rawScores = [{ user_id: '441555', ca_id: '341930', name: 'blah blah', activity_classification_id: '1', activity_name: 'America Used to be a Different Place', updated_at: '2016-09-16 15:39:00.775325', percentage: '1', id: '5951806', }];

const data = {
  teacher: { premium_state: 'trial', },
  is_last_page: false,
  classrooms,
  units,
  scores: JSON.parse(JSON.stringify(rawScores)),
};

describe('Scorebook component', () => {
  it('should render', () => {
    const wrapper = shallow(<Scorebook />);
    expect(wrapper).toMatchSnapshot();
  });
  //
  describe('if state.missing has a value', () => {
    const wrapper = shallow(<Scorebook />);
    wrapper.setState({ missing: 'activities', });

    it('renders EmptyProgressReport', () => {
      expect(wrapper.find(EmptyProgressReport).length).toEqual(1);
    });

    it('does not render LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(0);
    });

    it('still renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1);
    });

    it('still renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1);
    });

    it('still renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1);
    });

    it('does not render StudentScores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(0);
    });

    // it('does not get rendered if it is not passed a value for missing', () => {
    //   const wrapper = shallow(<Scorebook missing={''}/>)
    //   expect(wrapper.find(EmptyProgressReport).length).toEqual(0)
    // })
  });

  describe('if state.loading is true', () => {
    const wrapper = shallow(<Scorebook />);
    wrapper.setState({ loading: true, });

    it('renders LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(1);
    });

    it('renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1);
    });

    it('renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1);
    });

    it('renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1);
    });

    it('does not render StudentScores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(0);
    });
  });

  describe('if it gets data when it had none', () => {
    const wrapper = shallow(<Scorebook />);
    wrapper.setState({ currentPage: 1, scores: new Map(), });
    wrapper.instance().displayData(data);

    it('does not render LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(0);
    });

    it('renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1);
    });

    it('renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1);
    });

    it('renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1);
    });

    it('updates the state.scores to be equal to the new ones', () => {
      expect(wrapper.state('scores')).toEqual(resolvedScores);
    });
  });

  describe('if it gets data when it had some', () => {
    const newResScores = new Map(resolvedScores);
    const newRawScores = Array.slice(rawScores);
    newRawScores[0].user_id = 'fakey';
    const wrapper = shallow(<Scorebook allClassrooms={classrooms} />);
    data.scores = newRawScores;
    wrapper.setState({ scores: newResScores, classroomFilters: classrooms, });
    wrapper.instance().displayData(data);
    it('does not render LoadingIndicator', () => {
      expect(wrapper.find(LoadingIndicator).length).toEqual(0);
    });

    it('renders ScorebookFilters', () => {
      expect(wrapper.find(ScorebookFilters).length).toEqual(1);
    });

    it('renders ScoreLegend', () => {
      expect(wrapper.find(ScoreLegend).length).toEqual(1);
    });

    it('renders AppLegend', () => {
      expect(wrapper.find(AppLegend).length).toEqual(1);
    });

    it('updates the state.scores to add the new ones', () => {
      const updated = { 441555: { name: 'blah blah', scores: [{ activity_classification_id: '1', caId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: '441555', }], }, fakey: { name: 'blah blah', scores: [{ activity_classification_id: '1', caId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: 'fakey', }], }, };
      const newScores = new Map(resolvedScores);
      newScores.set('441555', { name: 'blah blah', scores: [{ activity_classification_id: '1', caId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: '441555', }], });
      newScores.set('fakey', { name: 'blah blah', scores: [{ activity_classification_id: '1', caId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: 'fakey', }], });
      expect(wrapper.state('scores')).toEqual(newScores);
    });

    it('renders as many StudentScores as there are state.scores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(wrapper.state('scores').size);
    });
  });
});
