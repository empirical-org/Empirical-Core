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
  console.log("new language picker", language)
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE
  const [lang, setLanguage] = React.useState(language) // TODO

  const onChange = (option: { value: string}) => {
    const language = option.value;
    updateLanguage(language)
    console.log("updating language")
  }

  const value = options().find(opt => lang === opt.value)
  if (onMobile()) {
    return (
      <button className="passthrough-button focus-on-light" onClick={handleClickOpenMobileLanguageMenu} type="button">
        <img alt="" src={languageIconSrc} />
        <span>Change directions language</span>
      </button>
    )
  }

  return (
    <div className="language-picker-container">
      <DropdownInput
        className="ell-language-selector large borderless"
        handleChange={onChange}
        isSearchable={false}
        options={options()}
        usesCustomOption
        value={value}
      />
    </div>
  )
}

export default LanguagePicker;
