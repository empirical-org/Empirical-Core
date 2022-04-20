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
  explanation?: string;
  changeLogs?: Array<ChangeLog>;
}

export interface ChangeLog {
  action: string;
  explanation: string;
  id?: string;
  conceptID?: string;
  user?: { name?: string };
  previousValue?: string;
  concept?: Concept
  createdAt?: number;
}

export interface LockerContentsInterface {
  label: string,
  route?: string,
  href?: string,
  emoji: string,
  emojiLabel: string,
  overrideTitleCase?: boolean,
  tooltipInfo?: string,
  lockers?: {
    [key:string]: string[]
  }
}

export interface LockerItemsInterface {
  [key:string]: LockerContentsInterface
}
