import React from 'react';
import { shallow } from 'enzyme';

import ListFilterOptions from '../list_filter_options';

import ListFilterOption from '../list_filter_option';

describe('ListFilterOptions component', () => {

  it('should generate ListFilterOption "All" if no options are passed in props', () => {
    const wrapper = shallow(
      <ListFilterOptions
        options={[]}
      />
    );
    expect(wrapper.find(ListFilterOption).exists()).toBe(true);
  });

  describe('with a user who is not logged in', () => {
    it('should generate ListFilterOption components w/ correct props', () => {
      const wrapper = shallow(
        <ListFilterOptions
          options={[
            {name: 'Elementary', id: 1},
            {name: 'Middle', id: 2}
          ]}
          userLoggedIn={false}
          selectedId={1}
        />
      );
      expect(wrapper.find(ListFilterOption).length).toBe(3);
      expect(wrapper.find(ListFilterOption).at(1).props().userLoggedIn).toBe(false);
      expect(wrapper.find(ListFilterOption).at(1).props().data.name).toBe('Elementary');
      expect(wrapper.find(ListFilterOption).at(1).props().isSelected).toBe(true);
    })
  });

  describe('with a user who is logged in', () => {
    it('should generate ListFilterOption components w/ correct props', () => {
      const wrapper = shallow(
        <ListFilterOptions
          options={[
            {name: 'Elementary', id: 1},
            {name: 'Middle', id: 2}
          ]}
          userLoggedIn={true}
          selectedId={2}
        />
      );
      expect(wrapper.find(ListFilterOption).length).toBe(3);
      expect(wrapper.find(ListFilterOption).at(1).props().userLoggedIn).toBe(true);
      expect(wrapper.find(ListFilterOption).at(1).props().data.name).toBe('Elementary');
      expect(wrapper.find(ListFilterOption).at(1).props().isSelected).toBe(false);
    })
  });

});
