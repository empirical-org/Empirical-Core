import * as React from 'react';

import useWindowSize from '../../../Shared/hooks/useWindowSize';
import LanguagePicker from '../../../Shared/components/translations/languagePicker';

interface FooterProps {
  diagnosticID: string,
  language: string,
  updateLanguage(language: string): any,
  handleClickOpenMobileLanguageMenu(): any
}

const MAX_VIEW_WIDTH_FOR_MOBILE = 895

const Footer = ({ language, handleClickOpenMobileLanguageMenu, updateLanguage, }: FooterProps) => {
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE
  const footerClassName = () => {
    const size = useWindowSize();
    if (size.width <= MAX_VIEW_WIDTH_FOR_MOBILE) {
      return "ell-footer mobile"
    } else {
      return "ell-footer"
    }
  }

  return (
    <div className={footerClassName()}>
      <div className="student-container">
        <LanguagePicker
          handleClickOpenMobileLanguageMenu={handleClickOpenMobileLanguageMenu}
          language={language}
          updateLanguage={updateLanguage}
        />
      </div>
    </div>
  )
}

export default Footer;
