import * as React from 'react';

import { DropdownInput } from '../../index';
import { languages, languageOptions } from "../../utils/languageList"

interface LanguagePickerProps {
  language: string,
  updateLanguage(language: string): any
}

const options = (): Array<{value: string, label: string}> => {
  return languages.map(language => ({
    value: language,
    label: languageOptions[language].label
  }))
}

const LanguagePicker = ({ language, updateLanguage, }: LanguagePickerProps) => {

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
