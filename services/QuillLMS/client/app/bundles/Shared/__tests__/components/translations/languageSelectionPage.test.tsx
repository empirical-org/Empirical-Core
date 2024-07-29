import * as React from "react";
import { render } from "@testing-library/react";
import { defaultLanguages } from '../../../utils/languageList'

import { LanguageSelectionPage } from "../../../components/translations/languageSelectionPage";

const mockProps = {
  dispatch: jest.fn(),
  setLanguage: jest.fn(),
  previewMode: false,
  begin: jest.fn(),
  languages: defaultLanguages
}

describe('LanguageSelectionPage', () => {
  test('it should render', () => {
    const { asFragment } = render(<LanguageSelectionPage {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
