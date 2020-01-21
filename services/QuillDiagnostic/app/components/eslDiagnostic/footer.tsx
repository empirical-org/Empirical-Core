import * as React from 'react'
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'
// import { DropdownInput } from '../../../../../packages/quill-component-library/src/components/shared/dropdownInput'

const ENGLISH = 'english'
const SPANISH = 'spanish'
const CHINESE = 'chinese'
const FRENCH = 'french'
const VIETNAMESE = 'vietnamese'
const ARABIC = 'arabic'
const HINDI = 'hindi'

const LANGUAGES = [ENGLISH, SPANISH, CHINESE, FRENCH, VIETNAMESE, ARABIC, HINDI]

const LANGUAGE_FLAG_MAP = {
  english: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png',
  spanish: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png',
  chinese: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png',
  french: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png',
  vietnamese: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png',
  arabic: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png',
  hindi: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png',
};

const LANGUAGE_DISPLAY_NAME_MAP = {
  english: 'English',
  spanish: 'Español',
  chinese: '中文',
  french: 'Français',
  vietnamese: 'Tiếng Việt',
  arabic: 'العربية',
  hindi: 'हिंद',
};

const options = (): Array<{value: string, label: string}> => {
  return LANGUAGES.map(lang => ({
    value: lang,
    label: (`<p><img alt={${LANGUAGE_DISPLAY_NAME_MAP[lang]} flag} src=${LANGUAGE_FLAG_MAP[lang]} /><span>${LANGUAGE_DISPLAY_NAME_MAP[lang]}</span></p>`)
  }))
}

class Footer extends React.Component {

  onChange = (option) => {
    const { updateLanguage, } = this.props
    updateLanguage(option.value)
  }

  render() {
    const { language, } = this.props
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

export default Footer
