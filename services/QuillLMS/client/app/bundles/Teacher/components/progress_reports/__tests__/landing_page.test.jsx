import { mount } from 'enzyme';
import * as React from 'react';

import { render, screen, }  from "@testing-library/react";

import * as requestsApi from '../../../../../modules/request'

import LandingPage from '../landing_page.jsx';

describe('LandingPage component', () => {
  it('matches the snapshot when the content hub data is loading', () => {
    const { asFragment, } = render(<LandingPage />);

    expect(asFragment()).toMatchSnapshot()
  });

  it('matches the snapshot when the user has assigned neither social studies nor science content', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ has_assigned_science_activities: false, has_assigned_social_studies_activities: false })))

    const { asFragment, } = render(<LandingPage />);

    expect(asFragment()).toMatchSnapshot()
  });

  it('matches the snapshot when the user has assigned both social studies and science content', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ has_assigned_science_activities: true, has_assigned_social_studies_activities: true })))

    const { asFragment, } = render(<LandingPage />);

    expect(asFragment()).toMatchSnapshot()
  });
})
