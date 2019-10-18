import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery'

import response from '../../../../../../../test_data/unit_template_profile'
import UnitTemplateProfile from '../unit_template_profile.jsx'
import LoadingIndicator from '../../../../shared/loading_indicator'
import UnitTemplateProfileDescription from '../unit_template_profile_description'

const props = {'history':{},'location':{'pathname':'/assign/featured-activity-packs/34','search':'','hash':'','state':null,'action':'POP','key':'cn21rg','query':{},'$searchBase':{'search':'','searchBase':''}},'params':{'activityPackId':'34'},'route':{'path':'featured-activity-packs/:activityPackId'},'routeParams':{'activityPackId':'34'},'routes':[{'path':'/teachers/classrooms/activity_planner','indexRoute':{},'childRoutes':[{'path':'featured-activity-packs(/category/:category)'},{'path':'featured-activity-packs(/grade/:grade)'},{'path':'featured-activity-packs/:activityPackId'},{'path':'featured-activity-packs/:activityPackId/assigned'},{'path':':tab'},{'path':'new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray'},{'path':'units/:unitId/students/edit'},{'path':'units/:unitId/activities/edit(/:unitName)'},{'path':'no_units'}]},{'path':'featured-activity-packs/:activityPackId'}],'children':null}

describe('UnitTemplateProfile component', () => {

  describe('the loading indicator', () => {
    it('should render a loading indicator by default', () => {
        const wrapper = shallow(
          <UnitTemplateProfile />
        );
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
    });

    it('should render a loading indicator if the state is loading', () => {
        const wrapper = shallow(
          <UnitTemplateProfile />
        );
        wrapper.setState({ loading: true });
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
    });

    it('should not render a loading indicator if the state is not loading', () => {
        const wrapper = shallow(
          <UnitTemplateProfile {...props} />
        );
        wrapper.setState({ loading: false, data: {non_authenticated: false}});
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
    });
  })

  describe('when the state is not loading', () => {
    it('should render UnitTemplateDescription', ()=> {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {non_authenticated: false}});
      expect(wrapper.find(UnitTemplateProfileDescription)).toHaveLength(1);
    })
  })

  describe('displayUnit', () => {

    const wrapper = shallow(
      <UnitTemplateProfile {...props} />
    );
    wrapper.instance().displayUnit(response)
    it('should set state.loading to be false', () => {
      expect(wrapper.state('loading')).toBe(false)
    })
    it('should set state.data to be response.data', () => {
      expect(wrapper.state('data')).toEqual(response.data)
    })

  })
});
