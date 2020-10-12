export interface Activity {
  name: string,
  description: string,
  flags: string[],
  id: number,
  uid: string,
  anonymous_path: string,
  activity_classification: ActivityClassification,
  activity_category: ActivityCategory,
  activity_category_name: string,
  activity_category_id: number,
  standard_level: StandardLevel,
  standard_level_id: number,
  standard_level_name: string
}

export interface ActivityClassification {
  alias: string,
  description: string,
  key: string,
  id: number
}

export interface ActivityCategory {
  id: number,
  name: string
}

interface StandardLevel {
  id: number,
  name: string
}
