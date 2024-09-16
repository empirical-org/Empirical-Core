import * as React from 'react';

import { DropdownInput, titleCase } from '../../index';
import { defaultLanguageOptions, defaultLanguages } from "../../utils/languageList";

interface LanguagePickerProps {
  language: string,
  languageOptions?: any,
  updateLanguage(language: string): any
}

const LanguagePicker = ({ language, updateLanguage, languageOptions }: LanguagePickerProps) => {
  const capitalizedLanguageOptions = languageOptions ? languageOptions.map(option => ({ value: option.value, label: titleCase(option.label) })) : null
  const options = (): Array<{value: string, label: string}> =>
    capitalizedLanguageOptions ?? defaultLanguages.map(language => ({
      value: language,
      label: defaultLanguageOptions[language].label
    }));

  const onChange = (option: { value: string}) => {
    const language = option.value;
    updateLanguage(language)
  }

  const value = options().find(opt => language === opt.value)

  return (
    <DropdownInput
      className="ell-language-selector medium borderless"
      handleChange={onChange}
      options={options()}
      value={value}
    />
  )
}

export default LanguagePicker;
