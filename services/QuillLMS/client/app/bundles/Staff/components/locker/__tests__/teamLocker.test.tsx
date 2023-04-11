import { shallow } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import TeamLocker from '../teamLocker';

const mockProps = {
  match: {
    params: {
      team: 'product'
    }
  }
}

describe('TeamLocker component', () => {
  const container = shallow(
    <MemoryRouter>
      <TeamLocker {...mockProps} />
    </MemoryRouter>
  );

  it('should render TeamLocker', () => {
    expect(container.find('withRouter(TeamLocker)').length).toEqual(1);
  });
});
