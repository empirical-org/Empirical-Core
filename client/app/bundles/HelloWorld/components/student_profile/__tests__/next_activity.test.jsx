import React from 'react';
import { shallow } from 'enzyme';

import NextActivity from '../next_activity';

import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip.jsx'
import LoadingIndicator from '../../shared/loading_indicator'

describe('NextActivity component', () => {

  it('should display a <LoadingIndicator /> component if props.loading is true', () => {
    const wrapper = shallow(
      <NextActivity
        loading={true}
      />
    );
    expect(wrapper.find(LoadingIndicator).exists()).toBe(true);
  });

  it('should display a linked button to start next activity if props.data is not empty', () => {
    const wrapper = shallow(
      <NextActivity
        data={{activity: {name: 'Activity Name' }, link: 'http://example.com' }}
      />
    );
    expect(wrapper.find('a').prop('href')).toBe('http://example.com');
    expect(wrapper.find('button').text()).toBe('Start Your Next Activity');
  });

  it('should <ActivityIconWithTooltip /> component with correct props if props.data is not empty', () => {
    const wrapper = shallow(
      <NextActivity
        data={{activity: {name: 'Activity Name'}}}
      />
    );
    expect(wrapper.find(ActivityIconWithTooltip).exists()).toBe(true);
    expect(wrapper.find(ActivityIconWithTooltip).prop('context')).toBe('studentProfile');
    expect(wrapper.find(ActivityIconWithTooltip).prop('placement')).toBe('bottom');
    expect(wrapper.find(ActivityIconWithTooltip).props().data.activity.name).toBe('Activity Name');
  });

  it('should display the activity\'s name if props.data is not empty', () => {
    const wrapper = shallow(
      <NextActivity
        data={{activity: {name: 'Activity Name'}}}
      />
    );
    expect(wrapper.find('.title').text()).toBe('Activity Name');
  });

  it('should not display if props.hasActivities is true and props.data is empty', () => {
    const wrapper = shallow(
      <NextActivity
        hasActivities={true}
      />
    );
    expect(wrapper.html()).toBe('<span></span>');
  });

  it('should display a message saying there are no activities assigned if props.data is empty and props.hasActivities is false', () => {
    const wrapper = shallow(
      <NextActivity />
    );
    expect(wrapper.find('p').text()).toBe('Your teacher hasn\'t assigned any activities to you yet.');
  });

});
