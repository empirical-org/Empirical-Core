import * as React from 'react';
import { shallow } from 'enzyme';

import HeaderImage from '../../../components/studentView/headerImage';

jest.mock('marked', () => ({
  default: jest.fn()
}));
jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

const mockProps = {
  headerImage: <img alt="header" />,
  passage: {
    image_caption: 'test caption',
    image_attribution: 'test attribution'
  }
};

describe('Activity Form component', () => {
  const container = shallow(<HeaderImage {...mockProps} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
});
