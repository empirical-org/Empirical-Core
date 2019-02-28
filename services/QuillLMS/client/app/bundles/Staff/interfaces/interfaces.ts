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
}
