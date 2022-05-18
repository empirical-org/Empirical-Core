export const grammarActivity =  {
  classification: {
    key: 'sentence',
    id: 1,
    name: 'Quill Grammar'
  },
  description: 'This is a test Grammar activity.',
  id: 1,
  level_zero_topic_name: null,
  name: "Their, They're, There",
  readability: '4th-5th',
  standard: {
    id: 1,
    name: '1.1 Test Grammar Standard',
    standard_category: {
      id: 1,
      name: 'Test Grammar Standard'
    }
  },
  standard_level_name: 'CCSS: Grade 4'
}

export const evidenceActivity =  {
  classification: {
    key: 'evidence',
    id: 2,
    name: 'Quill Reading for Evidence'
  },
  description: 'This is a test Evidence activity.',
  id: 2,
  level_zero_topic_name: null,
  name: "How Does Drought Affect Hydroelectricity Generation?",
  readability: '8th-9th',
  standard: {
    id: 2,
    name: '1.1 Test Evidence Standard',
    standard_category: {
      id: 2,
      name: 'Test Evidence Standard'
    }
  },
  standard_level_name: 'CCSS: Grade 8'
}

export const activityPack = {
  name: 'Test Activity Pack',
  non_authenticated: false,
  time: 60,
  activities: [grammarActivity],
  activity_info: '',
  created_at: 123123123,
  diagnostics_recommended_by: null,
  flag: '',
  grades: [],
  id: 3,
  number_of_standards: 0,
  order_number: 0,
  readability: '',
  type: {
    name: '',
    primary_color: ''
  },
  unit_template_category: {
    primary_color: '',
    secondary_color: '',
    name: '',
    id: 4
  }
}
