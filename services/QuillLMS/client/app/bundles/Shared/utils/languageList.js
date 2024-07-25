export const ENGLISH = 'english';
export const CHINESE = 'chinese';
export const HINDI = 'hindi';
export const SPANISH = 'spanish';
export const FRENCH = 'french';
export const ARABIC = 'arabic';
export const RUSSIAN = 'russian';
export const PORTUGUESE = 'portuguese';
export const URDU = 'urdu';
export const GERMAN = 'german';
export const JAPANESE = 'japanese';
export const KOREAN = 'korean';
export const VIETNAMESE = 'vietnamese';
export const THAI = 'thai';
export const UKRAINIAN = 'ukrainian';
export const TAGALOG = 'tagalog';
export const DARI = 'dari';
export const localeToLanguageMap = {
  "en": ENGLISH,
  "zh-cn": CHINESE,
  "zh-tw": CHINESE,
  "hi": HINDI,
  "es": SPANISH,
  "es-la": SPANISH,
  "fr": FRENCH,
  "ar": ARABIC,
  "ru": RUSSIAN,
  "pt": PORTUGUESE,
  "pt-br": PORTUGUESE,
  "ur": URDU,
  "de": GERMAN,
  "ja": JAPANESE,
  "ko": KOREAN,
  "vi": VIETNAMESE,
  "th": THAI,
  "uk": UKRAINIAN,
  "tl": TAGALOG,
  "fil": TAGALOG,
  "prs": DARI
};
export const languages = [ENGLISH, CHINESE, HINDI, SPANISH, FRENCH, ARABIC, RUSSIAN, PORTUGUESE, URDU, GERMAN, JAPANESE, KOREAN, VIETNAMESE, THAI, UKRAINIAN, TAGALOG, DARI];
export const rightToLeftLanguages = [ARABIC, URDU, DARI];

export const diagnosticLanguageOptions = {
  [ENGLISH]: {
    flag: 'https://assets.quill.org/images/flags/usa.png',
    label: 'English'
  },
  [CHINESE]: {
    flag: 'https://assets.quill.org/images/flags/china.png',
    label: '中文'
  },
  [HINDI]: {
    flag: 'https://assets.quill.org/images/flags/india.png',
    label: 'हिंदी'
  },
  [SPANISH]: {
    flag: 'https://assets.quill.org/images/flags/spain.png',
    label: 'Español'
  },
  [FRENCH]: {
    flag: 'https://assets.quill.org/images/flags/france.png',
    label: 'Français'
  },
  [ARABIC]: {
    flag: 'https://assets.quill.org/images/flags/egypt.png',
    label: 'العربية'

  },
  [RUSSIAN]: {
    flag: 'https://assets.quill.org/images/flags/russia.png',
    label: 'Русский'

  },
  [PORTUGUESE]: {
    flag: 'https://assets.quill.org/images/flags/brazil.png',
    label: 'Português'

  },
  [URDU]: {
    flag: 'https://assets.quill.org/images/flags/pakistan.png',
    label: 'اردو'
  },
  [GERMAN]: {
    flag: 'https://assets.quill.org/images/flags/germany.png',
    label: 'Deutsch'
  },
  [JAPANESE]: {
    flag: 'https://assets.quill.org/images/flags/japan.png',
    label: '日本語'
  },
  [KOREAN]: {
    flag: 'https://assets.quill.org/images/flags/south_korea.png',
    label: '한국어'
  },
  [VIETNAMESE]: {
    flag: 'https://assets.quill.org/images/flags/vietnam.png',
    label: 'Tiếng Việt'
  },
  [THAI]: {
    flag: 'https://assets.quill.org/images/flags/thailand.png',
    label: 'ไทย'
  },
  [UKRAINIAN]: {
    flag: 'https://assets.quill.org/images/flags/ukraine.png',
    label: 'Українська'
  },
  [TAGALOG]: {
    flag: 'https://assets.quill.org/images/flags/philippines.png',
    label: 'Tagalog'
  },
  [DARI]: {
    flag: 'https://assets.quill.org/images/flags/afghanistan.png',
    label: 'درى'
  },
}
