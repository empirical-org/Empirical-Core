import * as React from 'react';
import { DropdownInput } from 'quill-component-library/dist/componentLibrary';
import { languages, languageData } from '../../../public/locales/languagePageInfo';

interface FooterProps {
  language: string,
  updateLanguage(language: string): any
}

const options = (): Array<{value: string, label: string}> => {
  return languages.map(language => ({
    value: language,
    label: (`<p><img alt={${languageData[language].label} flag} src=${languageData[language].flag} /><span>${languageData[language].label}</span></p>`)
  }))
}

class Footer extends React.Component<FooterProps> {

  onChange = (option: { value: string}) => {
    const language = option.value;
    const { updateLanguage, } = this.props;
    updateLanguage(language)
  }

  render() {
    const { language, } = this.props;
    const value = options().find(opt => language === opt.value)
    return (<div className="ell-footer">
      <div className="student-container">
        <DropdownInput
          className="ell-language-selector"
          handleChange={this.onChange}
          label="Directions language"
          options={options()}
          usesCustomOption
          value={value}
        />
      </div>
    </div>)
  }
}

export default Footer;
