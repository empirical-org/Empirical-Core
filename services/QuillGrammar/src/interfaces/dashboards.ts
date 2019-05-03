export interface DashboardActivity {
  link: string;
  title: string;
  flag: string;
}

export interface DashboardConcept {
  link: string;
  name: string;
}

export interface DashboardQuestionRow {
  concept: DashboardConcept|{};
  concept_uid: string;
  explicitlyAssignedActivities: Array<DashboardActivity>;
  implicitlyAssignedActivities: Array<DashboardActivity>;
  link: string;
  noActivities: Boolean;
  prompt: string;
  flag?: string;
}

export interface DashboardConceptRow {
  link: string;
  name: string;
  explicitlyAssignedActivities: Array<DashboardActivity>;
  implicitlyAssignedActivities: Array<DashboardActivity>;
}
