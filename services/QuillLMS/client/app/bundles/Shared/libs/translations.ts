import { ENGLISH } from '../utils/languageList'

export const getlanguageOptions = (translations) => ([
  { value: ENGLISH, label: ENGLISH },
  ...Object.keys(translations).map(language => ({
    value: language,
    label: language
  }))
]);
