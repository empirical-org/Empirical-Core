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

export interface ConceptResults {
  pre?: ConceptResults;
  post?: ConceptResults;
  questions?: Question[]
}

interface Question {
  directions: string;
  prompt: string;
  answer: string;
  concepts: ConceptResult;
  question_number: string;
}

interface ConceptResult {
  id: number;
  name: string;
  correct: boolean;
  lastFeedback: string;
  attempt: number;
  answer: string;
  directions: string;
}

export interface SkillResults {
  skills: Array<Skill>
}

export interface SkillGroup {
  skills: Array<Skill>;
  acquired_skill_ids: number[];
  id: number;
  number_of_correct_skills_text: string;
  post_test_proficiency: string;
  pre_test_proficiency: string;
  proficiency_text: string;
  skill_group: string;
}

export interface Skill {
  pre?: Skill;
  post?: Skill;
  skill?: string;
  number_correct: number;
  number_incorrect: number;
  summary: string;
}

export interface SkillGroupSummary {
  name: string;
  description?: string;
  not_yet_proficient_in_post_test_student_names?: string[];
  not_yet_proficient_in_pre_test_student_names?: string[];
}

export interface StudentResult {
  name: string;
  id?: number;
  skill_groups?: SkillGroup[];
  total_acquired_skills_count?: number;
}

export interface OpenPopover {
  studentId?: number;
  skillGroupId?: number;
}

export interface Recommendation {
  activity_pack_id: number;
  name: string;
  activity_count: number;
  students: number[];
}

export interface LessonRecommendation {
  activities: LessonsActivity[];
  activity_pack_id: number;
  name: string;
  percentage_needing_instruction: number;
  previously_assigned: boolean;
  students_needing_instruction: string[];
}

export interface LessonsActivity {
  name: string;
  url: string;
}

export interface Student {
  id: number;
  name: string;
  completed: boolean;
}
