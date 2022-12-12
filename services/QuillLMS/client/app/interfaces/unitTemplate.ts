import { Activity } from './activity';

export interface UnitTemplateProfileInterface {
  id: number,
  name: string
  time: number,
  grades: Array<string>
  order_number: number,
  created_at: number,
  number_of_standards: number,
  activity_info: string,
  author: {
    name: string,
    avatar_url: string
  },
  unit_template_category: {
    primary_color: string,
    secondary_color: string,
    name: string,
    id: 5
  },
  activities: Activity[],
  type: {
    name: string,
    primary_color: string,
  },
  non_authenticated: boolean,
  flag: string
}

export interface UnitTemplateCategoryInterface {
  id: number,
  name: string,
  primary_color: string,
  secondary_color?: string
}

export interface UnitTemplateInterface {
  id: number,
  name: string,
  readability?: string,
  grade_level_range?: string,
  activities: Activity[],
  time: string,
  unit_template_category: UnitTemplateCategoryInterface,
  tools: string[],
}
