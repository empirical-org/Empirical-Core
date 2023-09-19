export interface CanvasInstance {
  client_id: string;
  id: number;
  client_secret: string;
  school_ids: number[];
  school_names: string[];
  url: string;
}

export interface School {
  id: number;
  name: string;
  subscription_status: any;
  subscriptions: any[];
}
