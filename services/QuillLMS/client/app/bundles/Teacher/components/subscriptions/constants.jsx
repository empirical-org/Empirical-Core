export const TEACHER_PREMIUM_TRIAL = "Teacher Premium Trial"
export const TEACHER_PREMIUM_CREDIT = "Teacher Premium Credit"
export const TEACHER_PREMIUM_SCHOLARSHIP = "Teacher Premium (Scholarship)"
export const TEACHER_PREMIUM = "Teacher Premium"
export const SCHOOL_PREMIUM = "School Premium"
export const SCHOOL_PREMIUM_SCHOLARSHIP = "School Premium (Scholarship)"
export const DISTRICT_PREMIUM = "District Premium"

export const ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES = {
  "Teacher Trial": TEACHER_PREMIUM_TRIAL,
  "Premium Credit": TEACHER_PREMIUM_CREDIT,
  "Teacher Sponsored Free": TEACHER_PREMIUM_SCHOLARSHIP,
  "Teacher Paid": TEACHER_PREMIUM,
  "College Board Educator Lifetime Premium": TEACHER_PREMIUM,
  "School Paid": SCHOOL_PREMIUM,
  "School Paid (via Stripe)": SCHOOL_PREMIUM,
  "School Sponsored Free": SCHOOL_PREMIUM_SCHOLARSHIP,
  "School District Paid": DISTRICT_PREMIUM
}

export const CREDIT_CARD = "Credit Card"
