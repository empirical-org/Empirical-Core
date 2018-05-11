import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery'

import response from '../../../../../../../test_data/unit_template_profile'
import UnitTemplateProfile from '../unit_template_profile.jsx'
import LoadingIndicator from '../../../../shared/loading_indicator'
import UnitTemplateProfileHeader from '../unit_template_profile_header.jsx'
import UnitTemplateProfileDescription from '../unit_template_profile_description'

jest.mock('jquery', () => {
  return {
    ajax: jest.fn()
  };
});


const props = {'history':{},'location':{'pathname':'/teachers/classrooms/assign_activities/featured-activity-packs/34','search':'','hash':'','state':null,'action':'POP','key':'cn21rg','query':{},'$searchBase':{'search':'','searchBase':''}},'params':{'activityPackId':'34'},'route':{'path':'featured-activity-packs/:activityPackId'},'routeParams':{'activityPackId':'34'},'routes':[{'path':'/teachers/classrooms/activity_planner','indexRoute':{},'childRoutes':[{'path':'featured-activity-packs(/category/:category)'},{'path':'featured-activity-packs(/grade/:grade)'},{'path':'featured-activity-packs/:activityPackId'},{'path':'featured-activity-packs/:activityPackId/assigned'},{'path':':tab'},{'path':'new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray'},{'path':'units/:unitId/students/edit'},{'path':'units/:unitId/activities/edit(/:unitName)'},{'path':'no_units'}]},{'path':'featured-activity-packs/:activityPackId'}],'children':null}

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
    it('should set state.relatedModels to be response.related_models', () => {
      expect(wrapper.state('relatedModels')).toEqual(response.related_models)
    })
    it('should set state.data to be response.data', () => {
      expect(wrapper.state('data')).toEqual(response.data)
    })

  })

  describe('getProfileInfo', () => {
    const wrapper = shallow(
      <UnitTemplateProfile {...props} />
    );

    const passedId = props.params.activityPackId

    wrapper.instance().getProfileInfo(passedId)

    it('should make an ajax call', () => {
      expect($.ajax.mock.calls.length).toBe(1)
    })

    it('should make an ajax call with datatype json', () => {
      expect($.ajax.mock.calls[0][0]['datatype']).toBe('json');
    })

    it('should make an ajax call with type get', () => {
      expect($.ajax.mock.calls[0][0]['type']).toBe('get');
    })

    it('should make an ajax call with url ', () => {
      expect($.ajax.mock.calls[0][0]['url']).toBe("/teachers/unit_templates/profile_info");
    })

    it('should make an ajax call with datatype json', () => {
      expect($.ajax.mock.calls[0][0]['datatype']).toBe('json');
    })

    it('should make an ajax call with a data object with the id it is passed', () => {
      expect($.ajax.mock.calls[0][0]['data']['id']).toBe(passedId);
    })

    it('should make an ajax call with a statusCode that fires a function on 200 ', () => {
      expect(typeof $.ajax.mock.calls[0][0]['statusCode']['200']).toBe('function');

    })

  })

  describe('componentDidMount', () => {
    const wrapper = shallow(
      <UnitTemplateProfile {...props} />
    );

    const getProfileInfoMock = jest.fn()
    wrapper.instance().getProfileInfo = getProfileInfoMock

    it('should call getProfileInfo', () => {
      wrapper.instance().componentDidMount()
      expect(getProfileInfoMock.mock.calls.length).toBe(1)
    })

  })

  describe('componentWillReceiveProps', () => {

    it('will not change state to loading if the new activityPackId is the same as the old activityPackId', () => {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {non_authenticated: false}});
      const nextProps = {location: {...props.location}, params: {activityPackId: props.params.activityPackId}}
      wrapper.instance().componentWillReceiveProps(nextProps)

      expect(wrapper.state('loading')).toBe(false)
    })

    it('will change state to loading if the new activityPackId is not the same as the old activityPackIdill reload the page if the new activityPackId is not the old activityPackId', () => {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );

      wrapper.setState({ loading: false, data: {non_authenticated: false}});
      const nextProps = {location: {1: 'a'}, params: {activityPackId: 1}}
      wrapper.instance().componentWillReceiveProps(nextProps)

      expect(wrapper.state('loading')).toBe(true)
    })

  })

});
