import React from 'react';
import { shallow } from 'enzyme';

import ListFilterOption from '../list_filter_option';

import { Link } from 'react-router'

describe('ListFilterOption component', () => {

  it('should render a <Link /> component', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'Name', id: 123 }}
      />
    );
    expect(wrapper.find(Link).exists()).toBe(true);
  });

  it('<Link /> component should have certain classname if props.isSelected is true', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'Name', id: 123 }}
        isSelected={false}
      />
    );
    expect(wrapper.find(Link).props().className).toBe('list-filter-option');
  });

  it('<Link /> component should have certain classname if props.isSelected is false', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'Name', id: 123 }}
        isSelected={true}
      />
    );
    expect(wrapper.find(Link).props().className).toBe('list-filter-option selected active');
  });

  it('<Link /> should have certain to prop if user is logged in and name of pack is all', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'all', id: 123 }}
        userLoggedIn={true}
      />
    );
    expect(wrapper.find(Link).prop('to')).toBe('/teachers/classrooms/assign_activities/featured-activity-packs');
  });

  it('<Link /> should have certain to prop if user is logged in and name of pack is not all', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'not-all', id: 123 }}
        userLoggedIn={true}
      />
    );
    expect(wrapper.find(Link).prop('to')).toBe('/teachers/classrooms/assign_activities/featured-activity-packs/category/not-all');
  });

  it('<Link /> should have certain to prop if user is not logged in and name of pack is all', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'all', id: 123 }}
        userLoggedIn={false}
      />
    );
    expect(wrapper.find(Link).prop('to')).toBe('/activities/packs');
  });

  it('<Link /> should have certain to prop if user is not logged in and name of pack is not all', () => {
    const wrapper = shallow(
      <ListFilterOption
        data={{ name: 'not-all', id: 123 }}
        userLoggedIn={false}
      />
    );
    expect(wrapper.find(Link).prop('to')).toBe('/activities/packs/category/not-all');
  });

});
