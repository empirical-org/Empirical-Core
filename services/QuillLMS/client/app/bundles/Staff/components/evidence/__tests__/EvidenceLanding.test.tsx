import { shallow } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import EvidenceLanding from '../EvidenceLanding';

const { firstBy } = jest.requireActual('thenby');

describe('EvidenceLanding component', () => {
  const container = shallow(
    <MemoryRouter>
      <EvidenceLanding />
    </MemoryRouter>
  );
  it('should render EvidenceLanding', () => {
    expect(container.find('withRouter(EvidenceLanding)').length).toEqual(1);
  });
});
