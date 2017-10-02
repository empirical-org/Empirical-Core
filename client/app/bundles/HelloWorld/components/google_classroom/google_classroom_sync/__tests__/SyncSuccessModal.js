import React from 'react';
import { shallow } from 'enzyme';
import SyncSuccessModal from '../SyncSuccessModal.jsx';

describe('the SyncSuccessModal component', () => {
  const wrapper = shallow(<SyncSuccessModal data={{ selectedClassrooms: [1, 2, 3, 4, 5], }} />);

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show the number of classes being synced', () => {
    expect(wrapper.find('h1').first().text()).toBe('Great! You\'ve synced 5 classes');
  });
});
