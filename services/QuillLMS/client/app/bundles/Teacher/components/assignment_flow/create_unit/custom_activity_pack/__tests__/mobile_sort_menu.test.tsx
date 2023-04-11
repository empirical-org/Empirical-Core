import { mount } from 'enzyme';
import * as React from 'react';


import MobileSortMenu from '../mobile_sort_menu';

describe('MobileSortMenu component', () => {
  const props = {
    setSort: (sort: string) => {},
    setShowMobileSortMenu: (show: boolean) => {},
    showMobileSortMenu: false
  }

  describe('with showMobileSortMenu false', () => {
    it('should render', () => {
      const wrapper = mount(<MobileSortMenu {...props} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

  describe('with showMobileSortMenu true', () => {
    it('should render', () => {
      const wrapper = mount(<MobileSortMenu {...props} showMobileSortMenu={true} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

})
