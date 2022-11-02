import React from 'react';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import Scorebook from '../Scorebook.jsx';
import EmptyProgressReport from '../../components/shared/EmptyProgressReport';
import LoadingIndicator from '../../components/shared/loading_indicator';
import StudentScores from '../../components/scorebook/student_scores';
import ScorebookFilters from '../../components/scorebook/scorebook_filters';
import ScoreLegend from '../../components/scorebook/score_legend';
import { AppLegend } from '../../components/scorebook/app_legend.tsx';

const resolvedScores = new Map();
resolvedScores.set('441555', { name: 'blah blah', scores: [{ cuId: '341930', userId: '441555', updated: '2016-09-16 15:39:00.775325', name: 'America Used to be a Different Place', percentage: '1', activity_classification_id: '1', completed_attempts: 0, started_at: '2016-09-16 15:39:00.775325', marked_complete: 'false', activityId: '1', started: 0}], }, );
const classrooms = [{ name: 'A', id: 1, }, { name: 'B', id: 2, }, { name: 'C', id: 3, }];
const units = [{ name: 'Something', id: 4, }, { name: 'Someone', id: 5, }, { name: 'Somewhere', id: 6, }];
const rawScores = [{ marked_complete: 'false', user_id: '441555', classroom_unit_id: '341930', name: 'blah blah', activity_classification_id: '1', activity_id: '1', activity_name: 'America Used to be a Different Place', started_at: '2016-09-16 15:39:00.775325', updated_at: '2016-09-16 15:39:00.775325', percentage: '1', id: '5951806', }];

const data = {
  teacher: { premium_state: 'trial', },
  is_last_page: false,
  classrooms,
  units,
  scores: JSON.parse(JSON.stringify(rawScores)),
};

describe('Scorebook component', () => {
  describe('if state.missing has a value', () => {
    const wrapper = shallow(<Scorebook allClassrooms={[]} />);
    wrapper.setState({ missing: 'activities', });

    describe('EmptyProgressReport', () => {
      it('renders', () => {
        expect(wrapper.find(EmptyProgressReport).length).toEqual(1);
      });

      it('receives classrooms as the missing prop value when appropriate', () => {
        const wrapper = shallow(<Scorebook allClassrooms={[]} />);
        wrapper.setState({ classroomFilters: [] });
        expect(wrapper.instance().checkMissing(new Map())).toBe('classrooms');
      });

      it('receives activities as the missing prop value when appropriate', () => {
        const wrapper = shallow(<Scorebook allClassrooms={[]} />);
        wrapper.setState({ anyScoresHaveLoadedPreviously: 'true', classroomFilters: [''] });
        expect(wrapper.instance().checkMissing(new Map())).toBe('activitiesWithinDateRange');
      });

      it('receives students as the missing prop value when appropriate', () => {
        const wrapper = shallow(<Scorebook allClassrooms={[]} />);
        wrapper.setState({ unitFilters: [''], classroomFilters: [''], anyScoresHaveLoadedPreviously: 'false' });
        expect(wrapper.instance().checkMissing(new Map())).toBe('students');
      });

      it('receives activitiesWithinDateRange as the missing prop value when appropriate', () => {
        const wrapper = shallow(<Scorebook allClassrooms={[]} />);
        wrapper.setState({ classroomFilters: [''], anyScoresHaveLoadedPreviously: 'false' });
        expect(wrapper.instance().checkMissing(new Map())).toBe('activities');
      });
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
  });

  describe('if state.loading is true', () => {
    const wrapper = shallow(<Scorebook allClassrooms={[]} />);
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
    const wrapper = shallow(<Scorebook allClassrooms={[]} />);
    wrapper.setState({ currentPage: 1, scores: new Map(), selectedClassroom: { id: 6 }});
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
    const newRawScores = rawScores;
    newRawScores[0].user_id = 'fakey';
    const wrapper = shallow(<Scorebook allClassrooms={classrooms} />);
    data.scores = newRawScores;
    wrapper.setState({ scores: newResScores, classroomFilters: classrooms, selectedClassroom: { id: 6 } });
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
      const newScores = new Map(resolvedScores);
      newScores.set('441555', { name: 'blah blah', scores: [{ activity_classification_id: '1', cuId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: '441555', completed_attempts: 0, started: 0, marked_complete: 'false', started_at: "2016-09-16 15:39:00.775325", activityId: "1"}], });
      newScores.set('fakey', { name: 'blah blah', scores: [{ activity_classification_id: '1', cuId: '341930', name: 'America Used to be a Different Place', percentage: '1', updated: '2016-09-16 15:39:00.775325', userId: 'fakey', completed_attempts: 0, started: 0, marked_complete: 'false', started_at: "2016-09-16 15:39:00.775325", activityId: "1"}], });
      expect(wrapper.state('scores')).toEqual(newScores);
    });

    it('renders as many StudentScores as there are state.scores', () => {
      expect(wrapper.find(StudentScores).length).toEqual(wrapper.state('scores').size);
    });
  });

  describe('selectDates function', () => {
    const wrapper = shallow(<Scorebook allClassrooms={[]} />);
    const beginDate = moment();
    const endDate = moment();
    const dateFilterName = 'All Time'
    wrapper.instance().fetchData = jest.fn();

    it('should set scorebookBeginDate as a stringified Moment object', () => {
      wrapper.instance().selectDates(beginDate, null, null);
      expect(localStorage.setItem).toHaveBeenCalledWith('scorebookBeginDate', beginDate);
    });

    it('should set scoreBookDateFilterName as a string', () => {
      wrapper.instance().selectDates(null, null, dateFilterName);
      expect(localStorage.setItem).toHaveBeenCalledWith('scorebookBeginDate', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('scorebookDateFilterName', dateFilterName);
    });

    it('should set state and call fetchData on callback', () => {
      wrapper.instance().selectDates(beginDate, endDate);
      expect(wrapper.state().scores).toEqual(new Map());
      expect(wrapper.state().beginDate).toBe(beginDate);
      expect(wrapper.state().endDate).toBe(endDate);
      expect(wrapper.instance().fetchData).toHaveBeenCalled();
    });
  });

  describe('convertStoredDateToMoment function', () => {
    const wrapper = shallow(<Scorebook allClassrooms={[]} />);
    const beginDate = moment().toString();
    const endDate = moment().toString();

    it('should get scorebookBeginDate and convert it to Moment', () => {
      expect(wrapper.instance().convertStoredDateToMoment(beginDate)).toEqual(moment(beginDate));
    });

    it('should get scorebookEndDate and convert it to Moment', () => {
      expect(wrapper.instance().convertStoredDateToMoment(endDate)).toEqual(moment(endDate));
    });
  });
});
