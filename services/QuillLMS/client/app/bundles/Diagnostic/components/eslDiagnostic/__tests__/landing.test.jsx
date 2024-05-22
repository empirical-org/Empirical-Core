import { mount } from 'enzyme';
import React from 'react';

import LandingPage from '../landingPage';

// TODO: add mocking of translate to simulate translation in tests

describe('LandingPage component', () => {
  describe('with no session present', () => {
    it('should render begin button', () => {
      const wrapper = mount(
        <LandingPage
          diagnosticID="-LyFRZvbHAmooTTIIVE2"
          language='spanish'
          translate={jest.fn()}
        />
      );
      expect(wrapper.find('.quill-button').text()).toBe('');
    });

    it('should pass begin prop to onClick', () => {
      const mockBegin = jest.fn();
      const wrapper = mount(
        <LandingPage
          begin={mockBegin}
          diagnosticID="-LyFRZvbHAmooTTIIVE2"
          language='spanish'
          translate={jest.fn()}
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
          diagnosticID="-LyFRZvbHAmooTTIIVE2"
          language='spanish'
          session='anything'
          translate={jest.fn()}
        />
      );
      expect(wrapper.find('.quill-button').text()).toBe('');
    });

    it('should pass resumeActivity prop to onClick with session argument', () => {
      const mockResumeActivity = jest.fn();
      const wrapper = mount(
        <LandingPage
          diagnosticID="-LyFRZvbHAmooTTIIVE2"
          language='spanish'
          resumeActivity={mockResumeActivity}
          session='anything'
          translate={jest.fn()}
        />
      );
      wrapper.find('.quill-button').simulate('click');
      expect(mockResumeActivity.mock.calls.length).toBe(1);
      expect(mockResumeActivity.mock.calls[0][0]).toBe('anything');
    });
  });
});
