import { shallow } from 'enzyme';
import * as React from 'react';

import { TeacherNavbar } from '../teacherNavbar';

const mockProps = {
  dispatch: () => jest.fn(),
  diagnosticID: 'bacana-banana',
  languageMenuOpen: true,
  previewShowing: true,
  onTogglePreview: () => jest.fn()
}

describe('TeacherNavbar', () => {
  beforeAll(() => {
    // this is needed to prevent TypeError: window.matchMedia is not a function
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });
  it('renders when the language menu is open', () => {
    const wrapper = shallow(<TeacherNavbar {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  })

  it('renders when the language menu is not open', () => {
    mockProps.languageMenuOpen = false;
    const wrapper = shallow(<TeacherNavbar {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
  })
})
