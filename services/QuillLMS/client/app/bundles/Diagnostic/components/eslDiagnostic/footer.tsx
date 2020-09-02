import * as React from 'react';
import { DropdownInput } from 'quill-component-library/dist/componentLibrary';
import { languages, languagesV2, languageData, languageDataV2 } from '../../modules/translation/languagePageInfo';

interface FooterProps {
  diagnosticID: string,
  language: string,
  updateLanguage(language: string): any
}

const options = (diagnosticID: string): Array<{value: string, label: string}> => {
  const langs = diagnosticID === 'ell' ? languages : languagesV2;
  const langData = diagnosticID === 'ell' ? languageData : languageDataV2;
  return langs.map(language => ({
    value: language,
    label: (`<p><img alt={${langData[language].label} flag} src=${langData[language].flag} /><span>${langData[language].label}</span></p>`)
  }))
}

class Footer extends React.Component<FooterProps> {

  onChange = (option: { value: string}) => {
    const language = option.value;
    const { updateLanguage, } = this.props;
    updateLanguage(language)
  }

  render() {
    const { diagnosticID, language } = this.props;
    const value = options(diagnosticID).find(opt => language === opt.value)
    return (<div className="ell-footer">
      <div className="student-container">
        <DropdownInput
          className="ell-language-selector"
          handleChange={this.onChange}
          label="Directions language"
          options={options(diagnosticID)}
          usesCustomOption
          value={value}
        />
      </div>
    </div>)
  }
}

export default Footer;
