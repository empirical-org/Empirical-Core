import React from 'react';
import { mount } from 'enzyme';

import Landing from '../landing';

describe('Landing component', () => {
  describe('with no session present', () => {
    it('should render begin button', () => {
      const wrapper = mount(
        <Landing
          begin={() => null}
          resumeActivity={() => null}
          language='spanish'
        />
      );
      expect(wrapper.find('.student-begin').text()).toBe('Begin / Comienzo');
    });

    it('should pass begin prop to onClick', () => {
      const mockBegin = jest.fn();
      const wrapper = mount(
        <Landing
          begin={mockBegin}
          resumeActivity={() => null}
          language='spanish'
        />
      );
      wrapper.find('.student-begin').simulate('click');
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
          language='spanish'
        />
      );
      expect(wrapper.find('.student-begin').text()).toBe('Resume / Reanudo');
    });

    it('should pass resumeActivity prop to onClick with session argument', () => {
      const mockResumeActivity = jest.fn();
      const wrapper = mount(
        <Landing
          begin={() => null}
          session={'anything'}
          resumeActivity={mockResumeActivity}
          language='spanish'
        />
      );
      wrapper.find('.student-begin').simulate('click');
      expect(mockResumeActivity.mock.calls.length).toBe(1);
      expect(mockResumeActivity.mock.calls[0][0]).toBe('anything');
    });
  });
});
