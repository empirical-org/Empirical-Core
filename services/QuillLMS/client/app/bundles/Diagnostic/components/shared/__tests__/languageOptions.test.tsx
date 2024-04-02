import { shallow } from 'enzyme';
import * as React from 'react';

import { languages } from '../../../modules/translation/languagePageInfo';
import { LanguageOptions } from '../languageOptions';

const mockProps = {
  dispatch: () => jest.fn(),
  diagnosticID: 'ell-starter'
}

describe('LanguageOptions component', () => {
  it('should render correct languages for ELL Diagnostics', () => {
    const component = shallow(<LanguageOptions {...mockProps} />);
    expect(component).toMatchSnapshot();
    languages.forEach((language: string, i: number)=> {
      expect(component.find('button').at(i).props().value).toEqual(language);
    });
  });
})
