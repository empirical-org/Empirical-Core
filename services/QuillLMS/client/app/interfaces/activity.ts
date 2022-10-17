export interface Activity {
  id: string,
  name: string,
  description: string,
  standard_level_name: string,
  grade_level_range: string,
  standard: {
    id: string,
    name: string,
    standard_category: {
      id: string,
      name: string
    }
  }
  classification: {
    key: string,
    id: string,
    name: string
  }
}
