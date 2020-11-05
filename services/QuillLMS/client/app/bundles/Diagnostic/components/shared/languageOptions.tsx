import * as React from "react";

import { closeLanguageMenu, updateLanguage, } from '../../actions/diagnostics'
import { languages, languagesV2, languageData, languageDataV2 } from '../../modules/translation/languagePageInfo';
import i18n from '../../i18n';

interface LanguageOptionsProps {
  dispatch: (action: () => any) => void;
  diagnosticID: string;
}

export const LanguageOptions = ({ diagnosticID, dispatch, }: LanguageOptionsProps) => {
  // once we remove the original ELL Diagnostic, we can move to have only have the second versions
  let langs = diagnosticID === 'ell' ? languages : languagesV2;
  let langData = diagnosticID === 'ell' ? languageData : languageDataV2;

  const handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    i18n.changeLanguage(language);
    dispatch(updateLanguage(language));
    dispatch(closeLanguageMenu())
  }

  return langs.map(language => {
    return(
      <button className="language-button" key={`${language}-button`} onClick={handleClickLanguage} type="button" value={language}>
        <img alt={`${language} flag`} src={langData[language].flag} />
        <span>{langData[language].label}</span>
      </button>
    );
  })
}
