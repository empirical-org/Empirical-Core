import { shallow } from 'enzyme';
import * as React from 'react';

import { TurkerView } from '../index';

describe('TurkerView Component', () => {
  const mockSession = { sessionID: 'saideira-maracuja' }
  const component = shallow(<TurkerView session={mockSession} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
