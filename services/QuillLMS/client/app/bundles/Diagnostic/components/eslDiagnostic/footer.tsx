import * as React from 'react';

import { DropdownInput } from '../../../Shared/index';
import useWindowSize from '../../../Shared/hooks/useWindowSize'
import { languages, languageData } from '../../modules/translation/languagePageInfo';

interface FooterProps {
  diagnosticID: string,
  language: string,
  updateLanguage(language: string): any,
  handleClickOpenMobileLanguageMenu(): any
}

const languageIconSrc = `${process.env.CDN_URL}/images/icons/language.svg`

const MAX_VIEW_WIDTH_FOR_MOBILE = 895

const options = (): Array<{value: string, label: string}> => {
  return languages.map(language => ({
    value: language,
    label: (`<p><img alt={${languageData[language].label} flag} src=${languageData[language].flag} /><span>${languageData[language].label}</span></p>`)
  }))
}

const Footer = ({ language, handleClickOpenMobileLanguageMenu, updateLanguage, }: FooterProps) => {
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const onChange = (option: { value: string}) => {
    const language = option.value;
    updateLanguage(language)
  }

  const value = options().find(opt => language === opt.value)
  if (onMobile()) {
    return (
      <div className="ell-footer mobile">
        <div className="student-container">
          <button className="passthrough-button focus-on-light" onClick={handleClickOpenMobileLanguageMenu} type="button">
            <img alt="" src={languageIconSrc} />
            <span>Change directions language</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ell-footer">
      <div className="student-container">
        <DropdownInput
          className="ell-language-selector"
          handleChange={onChange}
          label="Directions language"
          options={options()}
          usesCustomOption
          value={value}
        />
      </div>
    </div>
  )
}

export default Footer;
