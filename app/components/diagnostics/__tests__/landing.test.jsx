import React from 'react';
import { mount } from 'enzyme';

import Landing from '../landing';
import ResumeOrBeginButton from '../../shared/resumeOrBeginButton.jsx'

describe('Landing component', () => {

  describe('with no session present', () => {
    it('should render begin button', () => {
      const wrapper = mount(
        <Landing
          begin={() => null}
          resumeActivity={() => null}
        />
      );
      expect(wrapper.find(ResumeOrBeginButton).text()).toBe('Begin');
    });

    it('should pass begin prop to onClick', () => {
      const mockBegin = jest.fn();
      const wrapper = mount(
        <Landing
          begin={mockBegin}
          resumeActivity={() => null}
        />
      );
      wrapper.find(ResumeOrBeginButton).simulate('click');
      expect(mockBegin.mock.calls.length).toBe(1);
    });
  });

  describe('with a session present', () => {
    it('should render continue button', () => {
      const wrapper = mount(
        <Landing
          begin={() => null}
          session={'anything'}
          resumeActivity={() => null}
        />
      );
      expect(wrapper.find(ResumeOrBeginButton).text()).toBe('Resume');
    });

    it('should pass resumeActivity prop to onClick with session argument', () => {
      const mockResumeActivity = jest.fn();
      const wrapper = mount(
        <Landing
          begin={() => null}
          session={'anything'}
          resumeActivity={mockResumeActivity}
        />
      );
      wrapper.find(ResumeOrBeginButton).simulate('click');
      expect(mockResumeActivity.mock.calls.length).toBe(1);
      expect(mockResumeActivity.mock.calls[0][0]).toBe('anything');
    });
  });

});
