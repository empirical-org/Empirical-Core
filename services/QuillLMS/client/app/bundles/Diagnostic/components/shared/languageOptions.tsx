import * as React from "react";

import { closeLanguageMenu, updateLanguage, } from '../../actions/diagnostics';
import i18n from '../../i18n';
import { languageOptions, languages } from '../../../Shared/utils/languageList';

interface LanguageOptionsProps {
  dispatch: (action: () => any) => void;
}

export const LanguageOptions = ({ dispatch }: LanguageOptionsProps) => {

  const handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    i18n.changeLanguage(language);
    dispatch(updateLanguage(language));
    dispatch(closeLanguageMenu())
  }

  return languages.map(language => {
    return(
      <button className="language-button" key={`${language}-button`} onClick={handleClickLanguage} type="button" value={language}>
        <img alt={`${language} flag`} src={languageOptions[language].flag} />
        <span>{languageOptions[language].label}</span>
      </button>
    );
  })
}
