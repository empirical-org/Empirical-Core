export interface Activity {
  id: string,
  name: string,
  description: string,
  section_name: string,
  topic: {
    id: string, 
    name: string, 
    topic_category: {
      id: string,
      name: string
    }
  }
  classification: {
    key: string, 
    id: string, 
    name: string
  }
}