import * as React from 'react';
import { shallow } from 'enzyme';

import { LanguageOptions } from '../languageOptions';
import { languages, languagesV2 } from '../../../modules/translation/languagePageInfo';

const mockProps = {
  dispatch: () => jest.fn(),
  diagnosticID: 'ell-starter'
}

describe('LanguageOptions component', () => {

  it('should render correct languages for ELL Diagnostic 1', () => {
    const component = shallow(<LanguageOptions {...mockProps} />);
    expect(component).toMatchSnapshot();
    languagesV2.forEach((language: string, i: number)=> {
      expect(component.find('button').at(i).props().value).toEqual(language);
    });
  });
  it('should render correct languages for ELL Diagnostic 2', () => {
    mockProps.diagnosticID = 'ell';
    const component = shallow(<LanguageOptions {...mockProps} />);
    expect(component).toMatchSnapshot();
    languages.forEach((language: string, i: number)=> {
      expect(component.find('button').at(i).props().value).toEqual(language);
    });
  });
})
