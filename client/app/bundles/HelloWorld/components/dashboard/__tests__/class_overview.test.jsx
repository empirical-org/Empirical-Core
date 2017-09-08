import React from 'react';
import { shallow } from 'enzyme';
import MockDate from 'mockdate';

import ClassOverview from '../class_overview';

import NewTools from '../new_tools_mini';
import OverviewMini from '../overview_mini';
import BetaMini from '../beta_mini';
import TeacherGuide from '../../teacher_guide/teacher_guide';
import PremiumPromo from '../premium_promo';
import PremiumMini from '../premium_mini';

describe('ClassOverview component', () => {
  describe('overview minis', () => {
    it('should render OverviewMinis with overviewObj for each in data', () => {
      const wrapper = shallow(
        <ClassOverview
          data={[
            {header: 'arbitrary-data'},
            {header: 'different-arbitrary-data'}
          ]}
        />
      );
      expect(wrapper.find(OverviewMini).length).toBe(2);
      expect(wrapper.find(OverviewMini).at(0).props().overviewObj.header).toBe('arbitrary-data');
      expect(wrapper.find(OverviewMini).at(1).props().overviewObj.header).toBe('different-arbitrary-data');
    });

    it('should render BetaMini if flag is beta', () => {
      const wrapper = shallow(<ClassOverview flag='beta' />);
      expect(wrapper.find(BetaMini).exists()).toBe(true);
    });

    it('should render TeacherGuide only if displayTeacherGuide is true in state', () => {
      const wrapper = shallow(<ClassOverview />);
      wrapper.setState({displayTeacherGuide: false});
      expect(wrapper.find(TeacherGuide).exists()).toBe(false);
      wrapper.setState({displayTeacherGuide: true});
      expect(wrapper.find(TeacherGuide).exists()).toBe(true);
    });
  });

  describe('premium minis', () => {
    it('should render PremiumPromo component if status is locked', () => {
      const wrapper = shallow(
        <ClassOverview
          premium='locked'
        />
      );
      expect(wrapper.find(PremiumPromo).exists()).toBe(true);
    });

    it('should render PremiumMini component if status is none and month is before June', () => {
      MockDate.set('3/28/17');
      const wrapper = shallow(
        <ClassOverview
          premium='none'
        />
      );
      expect(wrapper.find(PremiumMini).exists()).toBe(true);
      MockDate.reset();
    });

    it('should render PremiumMini component if status is null and month is before June', () => {
      MockDate.set('3/28/17');
      const wrapper = shallow(
        <ClassOverview
          premium={null}
        />
      );
      expect(wrapper.find(PremiumMini).exists()).toBe(true);
      MockDate.reset();
    });

    it('should not render PremiumMini component if status is none and month is June or after', () => {
      MockDate.set('6/1/2017');
      const wrapper = shallow(
        <ClassOverview
          premium='none'
        />
      );
      expect(wrapper.find(PremiumMini).exists()).toBe(false);
      MockDate.reset();
    });

    it('should not render PremiumMini component if status is null and month is June or after', () => {
      MockDate.set('6/1/2017');
      const wrapper = shallow(
        <ClassOverview
          premium={null}
        />
      );
      expect(wrapper.find(PremiumMini).exists()).toBe(false);
      MockDate.reset();
    });
  });

});
