import * as React from 'react';
import { render } from '@testing-library/react';

import SocialStudiesSubjectPage from '../SocialStudiesSubjectPage';
import * as requestsApi from '../../../../modules/request';

describe('SocialStudiesSubjectPage', () => {
  test('renders correctly', async () => {
    const { asFragment } = render(<SocialStudiesSubjectPage />);

    expect(asFragment()).toMatchSnapshot();
  })
})
