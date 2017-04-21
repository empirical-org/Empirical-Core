import React from 'react';
import { shallow } from 'enzyme';

import Landing from '../landing';

describe('Landing component', () => {
  describe('with no session present', () => {
    it('should render begin button', () => {
      const wrapper = shallow(
        <Landing
          begin={() => null}
          resumeActivity={() => null}
        />
      );
      expect(wrapper.find('.student-begin').text()).toBe('Begin / Comienzo ');
    });

    it('should pass begin prop to onClick', () => {
      const mockBegin = jest.fn();
      const wrapper = shallow(
        <Landing
          begin={mockBegin}
          resumeActivity={() => null}
        />
      );
      wrapper.find('.student-begin').simulate('click');
      expect(mockBegin.mock.calls.length).toBe(1);
    });
  });

  describe('with a session present', () => {
    it('should render continue button', () => {
      const wrapper = shallow(
        <Landing
          begin={() => null}
          session={'anything'}
          resumeActivity={() => null}
        />
      );
      expect(wrapper.find('.student-begin').text()).toBe('Resume / Reanudo ');
    });

    it('should pass resumeActivity prop to onClick with session argument', () => {
      const mockResumeActivity = jest.fn();
      const wrapper = shallow(
        <Landing
          begin={() => null}
          session={'anything'}
          resumeActivity={mockResumeActivity}
        />
      );
      wrapper.find('.student-begin').simulate('click');
      expect(mockResumeActivity.mock.calls.length).toBe(1);
      expect(mockResumeActivity.mock.calls[0][0]).toBe('anything');
    });
  });
});
