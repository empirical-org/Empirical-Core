import { shallow } from 'enzyme';
import * as React from 'react';

import { BECAUSE, BUT, SO } from '../../../../Shared/index';
import { PostActivitySlide } from '../../../components/activitySlides/postActivitySlide';

describe('PostActivitySlide Component', () => {
  const mockProps = {
    responses: {
      1: [{ entry: 'test1' }],
      2: [{ entry: 'test2' }],
      3: [{ entry: 'test3' }]
    },
    prompts: [{conjunction: BECAUSE, text: 'test'}, {conjunction: BUT, text: 'test'}, {conjunction: SO, text: 'test'}],
    handleClick: jest.fn()
  }
  let component = shallow(<PostActivitySlide {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
