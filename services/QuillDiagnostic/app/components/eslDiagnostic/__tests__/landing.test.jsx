import React from 'react';
import { mount } from 'enzyme';

import LandingPage from '../landingPage';

describe('LandingPage component', () => {
  describe('with no session present', () => {
    it('should render begin button', () => {
      const wrapper = mount(
        <LandingPage
          language='spanish'
        />
      );
      expect(wrapper.find('.quill-button').text()).toBe('Begin / Comienzo');
    });

    it('should pass begin prop to onClick', () => {
      const mockBegin = jest.fn();
      const wrapper = mount(
        <LandingPage
          begin={mockBegin}
          language='spanish'
        />
      );
      wrapper.find('.quill-button').simulate('click');
      expect(mockBegin.mock.calls.length).toBe(1);
    });
  });

  describe('with a session present', () => {
    it('should render continue button', () => {
      const wrapper = mount(
        <LandingPage
          language='spanish'
          session='anything'
        />
      );
      expect(wrapper.find('.quill-button').text()).toBe('Resume / Reanudo');
    });

    it('should pass resumeActivity prop to onClick with session argument', () => {
      const mockResumeActivity = jest.fn();
      const wrapper = mount(
        <LandingPage
          language='spanish'
          resumeActivity={mockResumeActivity}
          session='anything'
        />
      );
      wrapper.find('.quill-button').simulate('click');
      expect(mockResumeActivity.mock.calls.length).toBe(1);
      expect(mockResumeActivity.mock.calls[0][0]).toBe('anything');
    });
  });
});
