import * as React from 'react';

import useWindowSize from '../../hooks/useWindowSize';
import { DropdownInput } from '../../index';
import { languages, languageOptions } from "../../utils/languageList"

interface LanguagePickerProps {
  language: string,
  updateLanguage(language: string): any,
  handleClickOpenMobileLanguageMenu(): any
}

const languageIconSrc = `${process.env.CDN_URL}/images/icons/language.svg`

const MAX_VIEW_WIDTH_FOR_MOBILE = 895

const options = (): Array<{value: string, label: string}> => {
  return languages.map(language => ({
    value: language,
    label: (`<p><img alt={${languageOptions[language].label} flag} src=${languageOptions[language].flag} /><span>${languageOptions[language].label}</span></p>`)
  }))
}

const LanguagePicker = ({ language, handleClickOpenMobileLanguageMenu, updateLanguage, }: LanguagePickerProps) => {
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const onChange = (option: { value: string}) => {
    const language = option.value;
    updateLanguage(language)
  }

  const value = options().find(opt => language === opt.value)
  if (onMobile()) {
    return (
      <button className="passthrough-button focus-on-light" onClick={handleClickOpenMobileLanguageMenu} type="button">
        <img alt="" src={languageIconSrc} />
        <span>Change directions language</span>
      </button>
    )
  }

  return (
    <DropdownInput
      className="ell-language-selector"
      handleChange={onChange}
      label="Directions language"
      options={options()}
      usesCustomOption
      value={value}
    />
  )
}

export default LanguagePicker;
