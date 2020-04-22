import React from 'react';
import { shallow, mount } from 'enzyme';
import { genericQuestion } from '../../../../test/data/jest_data.js';
import { FocusPointsContainer } from '../focusPointsContainer.jsx';
import { SortableList } from 'quill-component-library/dist/componentLibrary';

function setup() {
  const params = { questionID: 100, };
  const questions = { data: { 100: genericQuestion, }, };
  const props = { params, questions, };
  const wrapper = shallow(<FocusPointsContainer {...props} />);

  return {
    props,
    wrapper,
  };
}

describe('The focusPointsContainer', () => {
  const { wrapper, } = setup();

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('focus points', () => {
    it('should render in a sortable list', () => {
      expect(wrapper.find(SortableList)).toHaveLength(1);
    });

    it('should render in the correct order', () => {
      const { props, } = setup();
      const wrapper = mount(
        <FocusPointsContainer {...props} />
        );
      const order = wrapper.find('.card-header-icon').map(node => Number(node.text()));
      expect(order).toEqual([1, 2, 3]);
    });
  });
});
