import React from 'react';
import { shallow } from 'enzyme';
import ArchiveClassesWarning from '../ArchiveClassesWarning.jsx';

describe('the ArchiveClassesWarning component', () => {
  it('should render', () => {
    const wrapper = shallow(<ArchiveClassesWarning />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should show the number of classes being archived', () => {
    const wrapper = shallow(<ArchiveClassesWarning data={{ archivedCount: 10, }} />);
    expect(wrapper.find('strong').first().text()).toBe('10 classrooms.');
  });

  it('should trigger the hideModal callBack when the back button is clicked', () => {
    const mockBackBtn = jest.fn();
    const wrapper = shallow(<ArchiveClassesWarning hideModal={mockBackBtn} />);
    wrapper.find('.close-modal').first().simulate('click');
    expect(mockBackBtn.mock.calls.length).toBe(1);
  });

  it('should trigger the syncClassroomsAjax callBack when the sync button is clicked', () => {
    const mockBackBtn = jest.fn();
    const wrapper = shallow(<ArchiveClassesWarning syncClassroomsAjax={mockBackBtn} />);
    wrapper.find('.sync-classrooms').first().simulate('click');
    expect(mockBackBtn.mock.calls.length).toBe(1);
  });
});
