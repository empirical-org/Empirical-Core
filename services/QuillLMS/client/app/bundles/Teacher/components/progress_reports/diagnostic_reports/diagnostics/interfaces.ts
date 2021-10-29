export interface Activity {
  activity_id: number,
  activity_name: string,
  assigned_count: number,
  assigned_date: string,
  classroom_id: number,
  classroom_name: string,
  classroom_unit_id: number,
  completed_count: number,
  post_test_id: number|null,
  skills_count: number,
  unit_id: number,
  unit_name: string,
}

export interface Diagnostic {
  name: string,
  pre: Activity,
  post?: Activity
}

export interface Classroom {
  name: string;
  id: string;
  diagnostics: Array<Diagnostic>;
}
