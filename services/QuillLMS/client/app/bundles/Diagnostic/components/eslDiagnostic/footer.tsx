import * as React from 'react';
import { DropdownInput } from '../../../Shared/index';
import useWindowSize from '../../hooks/useWindowSize'
import { languages, languagesV2, languageData, languageDataV2 } from '../../modules/translation/languagePageInfo';

interface FooterProps {
  diagnosticID: string,
  language: string,
  updateLanguage(language: string): any,
  handleClickOpenMobileLanguageMenu(): any
}

const languageIconSrc = `${process.env.CDN_URL}/images/icons/language.svg`

const MAX_VIEW_WIDTH_FOR_MOBILE = 895

const options = (diagnosticID: string): Array<{value: string, label: string}> => {
  const langs = diagnosticID === 'ell' ? languages : languagesV2;
  const langData = diagnosticID === 'ell' ? languageData : languageDataV2;
  return langs.map(language => ({
    value: language,
    label: (`<p><img alt={${langData[language].label} flag} src=${langData[language].flag} /><span>${langData[language].label}</span></p>`)
  }))
}

const Footer = ({ diagnosticID, language, handleClickOpenMobileLanguageMenu, updateLanguage, }: FooterProps) => {
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const onChange = (option: { value: string}) => {
    const language = option.value;
    updateLanguage(language)
  }

  const value = options(diagnosticID).find(opt => language === opt.value)
  if (onMobile()) {
    return (
      <div className="ell-footer mobile">
        <div className="student-container">
          <button className="passthrough-button focus-on-light" onClick={handleClickOpenMobileLanguageMenu} type="button">
            <img alt="" src={languageIconSrc} />
            <span>Change directions language</span>
          </button>
        </div>
      </div>)
    }

    return (<div className="ell-footer">
      <div className="student-container">
        <DropdownInput
          className="ell-language-selector"
          handleChange={onChange}
          label="Directions language"
          options={options(diagnosticID)}
          usesCustomOption
          value={value}
        />
      </div>
    </div>
  )
}

export default Footer;
