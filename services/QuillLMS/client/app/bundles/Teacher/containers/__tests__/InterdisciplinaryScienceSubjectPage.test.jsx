import * as React from 'react';
import { render } from '@testing-library/react';

import InterdisciplinaryScienceSubjectPage from '../InterdisciplinaryScienceSubjectPage';
import * as requestsApi from '../../../../modules/request';

describe('InterdisciplinaryScienceSubjectPage', () => {
  test('renders correctly', async () => {
    const { asFragment } = render(<InterdisciplinaryScienceSubjectPage />);

    expect(asFragment()).toMatchSnapshot();
  })
})
