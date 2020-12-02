export interface Record {
  name: string,
  visible: boolean,
  id?: number,
  standard_category_id?: number,
  standard_level_id?: number,
  change_logs?: any[]
}

export interface StandardLevel {
  name: string,
  id: number,
  visible: boolean,
}

export interface StandardCategory {
  name: string,
  id: number,
  visible: boolean
}
