import React from 'react';
import { shallow } from 'enzyme';

import ChampionInvitationMini from '../champion_invitation_mini';

describe('ChampionInvitationMini component', () => {

  it('should render', () => {
    expect(shallow(<ChampionInvitationMini />)).toMatchSnapshot();
  });

});
