import React from 'react';
import { shallow } from 'enzyme';

import moment from 'moment';

import Scorebook from '../Scorebook.jsx';
import EmptyProgressReport from '../../components/shared/EmptyProgressReport';
import LoadingIndicator from '../../components/shared/loading_indicator';
import StudentScores from '../../components/scorebook/student_scores';
import ScorebookFilters from '../../components/scorebook/scorebook_filters';
import ScoreLegend from '../../components/scorebook/score_legend';
import AppLegend from '../../components/scorebook/app_legend.jsx';

const classrooms = [{ name: 'A', id: 1, }, { name: 'B', id: 2, }, { name: 'C', id: 3, }];
const units = [{ name: 'Something', id: 4, }, { name: 'Someone', id: 5, }, { name: 'Somewhere', id: 6, }];
const scores = [];

for (let x = 0; x < 30; x++) {
  scores.push({ results: '', user: { id: x, }, });
}

jest.mock('request', () => ({ get: JSON.stringify({ scores: [{ user_id: '666', ca_id: '391646', name: 'teacher teacher', activity_classification_id: '4', activity_name: 'Sentence Structure Diagnostic', updated_at: '2016-09-30 00:05:50.361093', percentage: '1', id: '6675910', }], }
), }));

const data = {
  teacher: { premium_state: 'trial', },
  is_last_page: false,
  classrooms,
  units,
  scores,
};

describe('Scorebook component', () => {
  it('should render', () => {
    const wrapper = shallow(<Scorebook />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('if props.missing has a value', () => {
    const wrapper = shallow(<Scorebook missing={'students'} />);

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
    wrapper.setState({ currentPage: 1, });
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
      expect(wrapper.state('scores')).toEqual(scores);
    });

    it('renders as many StudentScores as there are state.scores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(wrapper.state('scores').length);
    });
  });

  describe('if it gets data when it had some', () => {
    const wrapper = shallow(<Scorebook />);
    const scoreArray = [{ results: '', user: { id: 666, }, }];
    wrapper.setState({ scores: scoreArray, });
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
      expect(wrapper.state('scores')).toEqual(scoreArray.concat(scores));
    });

    it('renders as many StudentScores as there are state.scores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(wrapper.state('scores').length);
    });
  });

  describe('selectedClassroom function', () => {
    it('returns All Classrooms if there is no selectedClassroom in props', () => {
      const wrapper = shallow(<Scorebook />);
      expect(wrapper.instance().selectedClassroom()).toEqual({ name: 'All Classrooms', value: '', });
    });

    it('returns props.selectedClassrom if there is a selectedClassroom in props', () => {
      const wrapper = shallow(<Scorebook selectedClassroom={classrooms[0]} />);
      expect(wrapper.instance().selectedClassroom()).toEqual(classrooms[0]);
    });
  });

  it('sets state.selectedUnit when selectUnit is called', () => {
    const wrapper = shallow(<Scorebook />);
    wrapper.instance().selectUnit(units[0]);
    expect(wrapper.state('selectedUnit')).toEqual(units[0]);
  });

  it('sets state.selectedClassroom when selectClassroom is called', () => {
    const wrapper = shallow(<Scorebook />);
    wrapper.instance().selectClassroom(classrooms[0]);
    expect(wrapper.state('selectedClassroom')).toEqual(classrooms[0]);
  });

  it('sets state.beginDate and state.endDate when selectDates is called', () => {
    const beginDate = moment(-7);
    const endDate = moment(7);
    const wrapper = shallow(<Scorebook />);
    wrapper.instance().selectDates(beginDate, endDate);
    expect(wrapper.state('beginDate')).toEqual(beginDate);
    expect(wrapper.state('endDate')).toEqual(endDate);
  });
});
