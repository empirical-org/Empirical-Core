export interface Activity {
  name: string
  description: string
  flags: string[]
  id: number
  uid: string
  anonymous_path: string
  activity_classification: ActivityClassification
  activity_category: ActivityCategory
  activity_category_name: string
  activity_category_id: number
  standard_level: StandardLevel
  standard_level_id: number
  standard_level_name: string
  content_partners: ContentPartner[]
  topics: Topic[]
  readability_grade_level?: string,
  maximum_grade_level?: number,
  minimum_grade_level?: number
}

export interface ActivityClassification {
  alias: string
  description: string
  key: string
  id: number
}

export interface ActivityCategory {
  id: number
  name: string
  order_number?: number
}

interface StandardLevel {
  id: number
  name: string
}

export interface ContentPartner {
  id: number
  name: string
  description: string
}

export interface Topic {
  id: number
  name: string
  level: number
  parent_id?: number
}

export interface ActivityCategoryEditor {
  activityCategories: ActivityCategory[]
  getActivityCategories: () => void
  setActivityCategories: (activityCategories: ActivityCategory[]) => void
  selectedActivityCategoryId: number
  handleActivityCategorySelect: (activityCategoryId: number) => void
  timesSubmitted: number
}
