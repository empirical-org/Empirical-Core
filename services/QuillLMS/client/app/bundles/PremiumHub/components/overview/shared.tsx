export const USAGE_HIGHLIGHTS = 'Usage Highlights'
export const PROFESSIONAL_DEVELOPMENT_AND_SUPPORT = 'Professional Development and Support'
export const ACCOUNT_MANAGEMENT = 'Account Management'
export const PREMIUM_REPORTS = 'Premium Reports'
export const INTEGRATIONS = 'Integrations'

export const iconLinkBase = `${process.env.CDN_URL}/images/pages/administrator/overview`

export const SECTION_NAME_TO_ICON_URL = {
  [USAGE_HIGHLIGHTS]: `${iconLinkBase}/bulb.svg`,
  [PROFESSIONAL_DEVELOPMENT_AND_SUPPORT]: `${iconLinkBase}/students.svg`,
  [ACCOUNT_MANAGEMENT]: `${iconLinkBase}/pencil.svg`,
  [PREMIUM_REPORTS]: `${iconLinkBase}/bar-graph-increasing-black.svg`,
  [INTEGRATIONS]: `${iconLinkBase}/checkbox-multiple.svg`
}
