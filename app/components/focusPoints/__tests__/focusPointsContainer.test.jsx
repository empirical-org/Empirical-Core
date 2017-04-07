import React from 'react';
import { shallow, mount } from 'enzyme';
import { genericQuestion } from '../../../../test/data/jest_data.js';
import { FocusPointsContainer } from '../focusPointsContainer.jsx';
import SortableList from '../../questions/sortableList/sortableList.jsx';

const params = { questionID: 100, };
const questions = { data: { 100: genericQuestion, }, };
const props = { params, questions, };

describe('The focusPointsContainer', () => {
  it('should render', () => {
    const wrapper = shallow(
      <FocusPointsContainer {...props} />
      );
    expect(wrapper).toMatchSnapshot();
  });

  describe('focus points', () => {
    it('should render in a sortable list', () => {
      const wrapper = shallow(
        <FocusPointsContainer {...props} />
        );
      expect(wrapper.find(SortableList)).toHaveLength(1);
    });

    it('should render in the correct order', () => {
      const wrapper = mount(
        <FocusPointsContainer {...props} />
        );
      const order = wrapper.find('.card-header-icon').map(node => Number(node.text()));
      expect(order).toEqual([1, 2, 3]);
    });
  });
});
