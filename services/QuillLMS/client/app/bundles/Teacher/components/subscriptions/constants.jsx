export const SALESMATE_RENEWAL_FORM_URL = "https://webforms.salesmate.io/webforms/#/cdc44d13-84f9-45e9-84c4-2136e1bdb5ca"

// subscription types (for display)
export const TEACHER_PREMIUM_TRIAL = "Teacher Premium Trial"
export const TEACHER_PREMIUM_CREDIT = "Teacher Premium Credit"
export const TEACHER_PREMIUM_SCHOLARSHIP = "Teacher Premium (Scholarship)"
export const TEACHER_PREMIUM = "Teacher Premium"
export const SCHOOL_PREMIUM = "School Premium"
export const SCHOOL_PREMIUM_SCHOLARSHIP = "School Premium (Scholarship)"
export const DISTRICT_PREMIUM = "District Premium"

// account types (from database)
export const TEACHER_TRIAL = "Teacher Trial"
export const PREMIUM_CREDIT = "Premium Credit"
export const TEACHER_SPONSORED_FREE = "Teacher Sponsored Free"
export const TEACHER_PAID = "Teacher Paid"
export const COLLEGE_BOARD_EDUCATOR_LIFETIME_PREMIUM = "College Board Educator Lifetime Premium"
export const SCHOOL_PAID = "School Paid"
export const SCHOOL_PAID_VIA_STRIPE = "School Paid (via Stripe)"
export const SCHOOL_SPONSORED_FREE = "School Sponsored Free"
export const SCHOOL_DISTRICT_PAID = "School District Paid"

// both subscription and account type
export const DISTRICT_DEMO = "District Demo"
export const SCHOOL_DEMO = "School Demo"

export const ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES = {
  [TEACHER_TRIAL]: TEACHER_PREMIUM_TRIAL,
  [PREMIUM_CREDIT]: TEACHER_PREMIUM_CREDIT,
  [TEACHER_SPONSORED_FREE]: TEACHER_PREMIUM_SCHOLARSHIP,
  [TEACHER_PAID]: TEACHER_PREMIUM,
  [COLLEGE_BOARD_EDUCATOR_LIFETIME_PREMIUM]: TEACHER_PREMIUM,
  [SCHOOL_PAID]: SCHOOL_PREMIUM,
  [SCHOOL_PAID_VIA_STRIPE]: SCHOOL_PREMIUM,
  [SCHOOL_SPONSORED_FREE]: SCHOOL_PREMIUM_SCHOLARSHIP,
  [SCHOOL_DISTRICT_PAID]: DISTRICT_PREMIUM,
  [DISTRICT_DEMO]: DISTRICT_DEMO,
  [SCHOOL_DEMO]: SCHOOL_DEMO,
}

export const CREDIT_CARD = "Credit Card"
