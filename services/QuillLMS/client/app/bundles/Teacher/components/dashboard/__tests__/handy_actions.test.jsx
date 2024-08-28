import * as React from 'react';
import { render } from '@testing-library/react';

import { handleHasAppSetting } from "../../../../Shared/utils/appSettingAPIs";
import HandyActions from '../handy_actions';
import * as requestsApi from '../../../../../modules/request'

jest.mock('../../../../Shared/utils/appSettingAPIs');

describe('HandyActions component', () => {

  it('should render when the user is not linked to Clever', () => {
    handleHasAppSetting.mockImplementation((args) => args.appSettingSetter(true));
    const { asFragment } = render(<HandyActions linkedToClever={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render when the user is linked to Clever', () => {
    handleHasAppSetting.mockImplementation((args) => args.appSettingSetter(true));
    const { asFragment } = render(<HandyActions linkedToClever={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render when the user has assigned science activities', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ has_assigned_science_activities: true, has_assigned_social_studies_activities: false })))
    const { asFragment, } = render(<HandyActions />);
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render when the user has assigned social studies activities', () => {
    const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => (callback({ has_assigned_science_activities: false, has_assigned_social_studies_activities: true })))
    const { asFragment, } = render(<HandyActions />);
    expect(asFragment()).toMatchSnapshot()
  })
});
