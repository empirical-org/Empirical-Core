export interface Concept {
  id?:string;
  name?:string;
  value?: string;
  label?: string;
  updatedAt?: string;
  visible?: Boolean;
  uid?: string;
  parent?:Concept;
  replacement?: Concept;
  description?: string;
  changeLogs?: Array<ChangeLog>;
}

export interface ChangeLog {
  action: string;
  description: string;
  conceptID?: string;
  id: string;
  user: { name: string };
  createdAt: number;
}
