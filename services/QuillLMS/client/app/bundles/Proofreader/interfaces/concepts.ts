export interface Concept {
  displayName: string;
  uid: string;
  id: number;
  level: number;
  name: string;
  parent_id: number|null;
  explanation?: string;
}
