import React from 'react';
import { shallow } from 'enzyme';

import EducatorType from '../educator_type';

import UsK12View from '../../school/us_k12_view'
import NotUsK12View from '../../school/not_us_k12_view'

describe('EducatorType component', () => {

  it('should render if stage is 1', () => {
      const wrapper = shallow(
        <EducatorType />
      );
      expect(wrapper).toMatchSnapshot();
  });

  it('should render UsK12View if stage state is 2', () => {
      const wrapper = shallow(
        <EducatorType />
      );
      wrapper.setState({ stage: 2 });
      expect(wrapper.find(UsK12View)).toHaveLength(1);
  });

  it('should render NotUsK12View if stage state is 3', () => {
      const wrapper = shallow(
        <EducatorType />
      );
      wrapper.setState({ stage: 3 });
      expect(wrapper.find(NotUsK12View)).toHaveLength(1);
  });

});
