import { shallow } from 'enzyme';
import * as React from 'react';

import HeaderImage from '../../../components/studentView/headerImage';

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

describe('Header Image component', () => {
  const container = shallow(<HeaderImage {...mockProps} />);

  it('should render Header Image', () => {
    expect(container).toMatchSnapshot();
  });
});
