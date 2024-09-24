import languageConstants from '../../../../../config/locales/languageConstants.json';

export const {
  ENGLISH,
  CHINESE,
  HINDI,
  SPANISH,
  FRENCH,
  ARABIC,
  RUSSIAN,
  PORTUGUESE,
  URDU,
  GERMAN,
  JAPANESE,
  KOREAN,
  VIETNAMESE,
  THAI,
  UKRAINIAN,
  TAGALOG,
  DARI
} = languageConstants;

export const defaultLanguages = [ENGLISH, CHINESE, HINDI, SPANISH, FRENCH, ARABIC, RUSSIAN, PORTUGUESE, URDU, GERMAN, JAPANESE, KOREAN, VIETNAMESE, THAI, UKRAINIAN, TAGALOG, DARI];
export const rightToLeftLanguages = [ARABIC, URDU, DARI];

export const defaultLanguageOptions = {
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

export const languageToLocale = {
  [ENGLISH]: 'en',
  [CHINESE]: 'zh-cn',
  [HINDI]: 'hi',
  [SPANISH]: 'es-la',
  [FRENCH]: 'fr',
  [ARABIC]: 'ar',
  [RUSSIAN]: 'ru',
  [PORTUGUESE]: 'pt-br',
  [URDU]: 'ur',
  [GERMAN]: 'de',
  [JAPANESE]: 'ja',
  [KOREAN]: 'ko',
  [VIETNAMESE]: 'vi',
  [THAI]: 'th',
  [UKRAINIAN]: 'uk',
  [TAGALOG]: 'tl',
  [DARI]: 'prs'
}

export const ALPHA_TRANSLATED_ACTIVITY_UIDS = [
  "2a9481f3-f910-42e2-9ae4-53cd73bbee47",
  "78cc6398-5259-4c6d-a37a-b0490184bed3",
  "90b977be-9e64-4c2b-83a4-addcfb92eac8",
  "06e087b2-6626-41b5-b113-13e990c2cabb",
  "9721ed85-47d7-4930-93cf-1b57bf1a0dce",
  "a7b84aa2-4215-4c6b-9ae7-4813f247d7bb",
  "acc77361-b80c-414d-ba11-5e56a45e8aff",
  "2a72b366-259b-4fc5-8108-1439f84a3094",
  "c2c551cd-c231-431a-a4cf-861186839020",
  "ea9e0db2-10cf-4e58-be67-5b90eb12b3d4",
  "7e6e9576-aaa0-4401-aefd-ed939ac009a9",
  "582a3f46-afd8-4337-b8a6-858f84b78961",
  "2ecef095-f63a-4c12-bc3f-6fd8f7fc577e",
  "6eaebc60-4288-4931-9d52-b81aad270ea9",
  "24674ecd-dc25-4db0-9115-9ae198d7b4b0",
  "da5836d1-793c-4835-b33b-ee673c20d444",
  "1d8ae118-3783-4669-983d-0d05e4eca292",
  "d707c2f5-d42b-4b3d-b8e3-ec6307034660",
  "f60fac99-f404-43a9-acc3-d0039d70e0cf",
  "09260fbf-f008-4592-b114-879ba7b38d32",
  "bce290af-27bc-49b7-9d53-45b7b59e1c1f",
  "3973edce-5321-4f63-88cd-f84288b275f4",
  "a55ac86d-e815-4490-8763-49e492801463",
  "2409c828-a9d8-4491-aa28-d3780013956a",
  "74e41e8c-25db-4b06-80e7-5c9432694173",
  "542f6188-92b8-49e4-b9df-810efdbc9fee",
  "8b551a3d-7eae-4672-8c3d-d8516fedb2bf",
  "abcc9513-cb6b-40c9-9c8e-eb5770a6b838",
  "13170c3b-b49c-4d96-8495-2c6cc0974b13",
  "cb5356d5-8d92-458a-83e9-b3c03904e6d0",
  "9a5e0e0e-3af7-4046-9d82-bcd45b208777",
  "86bdb660-7a01-49f2-8332-28d811a9a422",
  "0dea4444-5146-46e3-9ebf-4bfa35712087",
  "03b59374-d120-4cb5-ac27-5b3d45b9e581",
  "6ee604d9-611d-466e-9eac-7812d77acbea",
  "53381c9b-ab29-437b-acee-17228f9ebc85",
  "bd3f0acc-e8c3-41f6-ae36-a9c65f007f87",
  "4b8bc1c7-ffd0-4b59-b8f8-91c4f4db35bc",
  "93f866a8-db6f-4f79-953c-ca1228eeebe1",
  "8706a43c-13b5-4ca0-9520-ed982250c96a",
  "21e71dab-b3c5-4776-8061-5cd6ee82e287",
  "d674d622-b551-4119-a727-e1909e79e232",
  "c94eaeb3-4a7a-4b3c-8709-bb7eee457f8a",
  "92f7e941-99c7-48c1-b927-4a2f6c0f021f",
  "27abce8c-6062-4938-aa85-74deebba5e40",
  "2a07dddd-796a-4f4f-83b6-b0ec03d3f370",
  "14534975-e3d0-460e-881b-ecd389f0fb96",
  "e2c285fd-b973-4d52-a2b3-0cb73b3b6391",
  "4f17260c-c793-4443-8902-0a5f81b92116",
  "7d363347-6ad3-4476-b124-6d0e08182cc8",
  "54c91530-d44a-4a9a-8ce9-af9c6680fd60"
]
