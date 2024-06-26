import * as React from "react";
import { connect } from "react-redux";

import { TeacherPreviewMenuButton } from '../../Shared/index';

import LanguagePicker from "../../Shared/components/translations/languagePicker"; // Export this through the index
import { openLanguageMenu, updateLanguage, getLanguage } from "../actions/session";
import * as LanguageList from '../../Shared/utils/languageList';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`;

interface HeaderProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
  language: string;
  dispatch;
}

export const Header: React.SFC<HeaderProps> = ({ isOnMobile, isTeacher, previewShowing, onTogglePreview, dispatch }) => {

  // const [language, setLanguage] = React.useState<string>(LanguageList.CHINESE);
  const handleTogglePreview = () => {
    onTogglePreview();
  }

  const dispatchUpdateLanguage = (language) => {
    dispatch(updateLanguage(language));
  }

  const handleClickOpenMobileLanguageMenu = () => {
    dispatch(openLanguageMenu())
    window.scrollTo(0, 0)
  }

  return (
    <div className="header">
      <div className="activity-navbar-content">
        {isTeacher && !previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
        <LanguagePicker
          handleClickOpenMobileLanguageMenu={handleClickOpenMobileLanguageMenu}
          language={LanguageList.ENGLISH}
          updateLanguage={dispatchUpdateLanguage}
        />
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
      </div>
    </div>
  );
};

function select(state) {
  return {
    session: state.session
  }
}

// const mapStateToProps = (state: any) => {
//   const { language } = state;
//   return {
//     language: language
//   };
// };


export default (connect(select)(Header))
