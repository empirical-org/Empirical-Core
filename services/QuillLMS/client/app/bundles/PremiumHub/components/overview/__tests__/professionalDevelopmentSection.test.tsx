import * as React from "react";
import { render, } from "@testing-library/react";

import ProfessionalDevelopmentSection, { ERIKA_EMAIL, SHANNON_EMAIL, } from '../professionalDevelopmentSection'
import * as requestsApi from '../../../../../modules/request';

const props = {
  administersSchoolWithPremium: true,
  adminId: 1
}

describe('ProfessionalDevelopmentSection', () => {
  test('it should render a loading state when the user administers a premium school', () => {
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('it should render a restricted state when the user does not administer a premium school', () => {
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} administersSchoolWithPremium={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('it should render the Erika-related info if she is their learning manager', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ name: 'Erika Parker-Havens', email: ERIKA_EMAIL })))
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render the Shannon-related info if she is their learning manager', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ name: 'Shannon Browne', email: SHANNON_EMAIL })))
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render the generic info if the learning manager is null', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback(null)))
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render the generic info if the learning manager is not Erika or Shannon', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => callback(({ name: 'Some Rando', email: 'somerando@quill.org' })))
    const { asFragment } = render(<ProfessionalDevelopmentSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

});
