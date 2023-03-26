import { mount } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { SortableList } from '../../../../Shared/index';
import { genericQuestion } from '../../../test/data/test_data.js';
import { FocusPointsContainer } from '../focusPointsContainer.jsx';

function setup() {
  const params = { questionID: 100, };
  const match = { params };
  const questions = { data: { 100: genericQuestion, }, };
  const props = { match, questions, };
  const wrapper = mount(
    <MemoryRouter>
      <FocusPointsContainer {...props} />
    </MemoryRouter>
  );

  return {
    props,
    wrapper,
  };
}

describe('The focusPointsContainer', () => {
  const { wrapper, } = setup();

  describe('focus points', () => {
    it('should render in a sortable list', () => {
      expect(wrapper.find(SortableList)).toHaveLength(1);
    });

    it('should render in the correct order', () => {
      const { props, } = setup();
      const wrapper = mount(
        <MemoryRouter>
          <FocusPointsContainer {...props} />
        </MemoryRouter>
      );
      const order = wrapper.find('.card-header-icon').map(node => Number(node.text()));
      expect(order).toEqual([1, 2, 3]);
    });
  });
});
