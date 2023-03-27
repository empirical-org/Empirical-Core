import { mount } from 'enzyme'
import * as React from 'react'

import GradeLevelWarningModal from '../gradeLevelWarningModal'

const props = {
  "selectedActivities": [
    {
      "name": "SpringBoard® Writing Skills Survey",
      "description": "Students answer questions on 7 areas of sentence structure aligned to the grammar instruction featured in the SpringBoard Language and Writer’s Craft and Language Checkpoint lesson components. These skills include subject-verb agreement, compound sentences, and subordinating conjunctions. This diagnostic is intended for grades 6-8.",
      "flags": "{production}",
      "id": 1432,
      "uid": "5dfe46da-e13c-4b5b-a71d-55a9ae5669b0",
      "anonymous_path": "/activity_sessions/anonymous?activity_id=1432",
      "activity_classification": {
        "alias": "Quill Diagnostic",
        "description": "Identify Learning Gaps",
        "key": "diagnostic",
        "id": 4
      },
      "activity_category": {
        "id": 48,
        "name": "Diagnostics"
      },
      "activity_category_name": "Diagnostics",
      "activity_category_id": 48,
      "standard_level": {
        "id": 0,
        "name": null
      },
      "standard_level_name": null,
      "standard_name": null,
      "content_partners": [
        {
          "name": "College Board",
          "description": "College Board is working with Quill to provide additional writing practice for Pre-AP, AP, and SpringBoard students. Quill activities align with Course Framework skills.",
          "id": 2
        }
      ],
      "topics": [],
      "readability_grade_level": null,
      "minimum_grade_level": null,
      "maximum_grade_level": null
    },
    {
      "name": "And, Because, Or (Intermediate)",
      "description": "Students practice writing compound and complex sentences by combining two sentences using one of the three provided joining words. Students must choose the joining word that best connects the ideas.",
      "flags": "{production}",
      "id": 897,
      "uid": "-LVKWAApZXBPkThVPINH",
      "anonymous_path": "/activity_sessions/anonymous?activity_id=897",
      "activity_classification": {
        "alias": "Quill Connect",
        "description": "Combine Sentences",
        "key": "connect",
        "id": 5
      },
      "activity_category": {
        "id": 14,
        "name": "Compound Sentences"
      },
      "activity_category_name": "Compound Sentences",
      "activity_category_id": 14,
      "standard_level": {
        "id": 9,
        "name": "CCSS: Grade 3"
      },
      "standard_level_name": "CCSS: Grade 3",
      "standard_name": "3.1h Use coordinating and subordinating conjunctions",
      "content_partners": [],
      "topics": [
        {
          "name": "Science",
          "level": 3,
          "id": 7,
          "parent_id": 0
        },
        {
          "name": "Various Animals",
          "level": 0,
          "id": 12,
          "parent_id": 0
        },
        {
          "name": "Animals",
          "level": 2,
          "id": 13,
          "parent_id": 7
        }
      ],
      "readability_grade_level": "8th-9th",
      "minimum_grade_level": 8,
      "maximum_grade_level": 12
    },
    {
      "name": "Compound-Complex Sentences (Intermediate)",
      "description": "Students practice writing compound-complex sentences by combining three sentences. Students are provided four joining words and must choose the two that best connect the ideas.",
      "flags": "{production}",
      "id": 1001,
      "uid": "-Lio40_H3wSaN21sp5--",
      "anonymous_path": "/activity_sessions/anonymous?activity_id=1001",
      "activity_classification": {
        "alias": "Quill Connect",
        "description": "Combine Sentences",
        "key": "connect",
        "id": 5
      },
      "activity_category": {
        "id": 14,
        "name": "Compound Sentences"
      },
      "activity_category_name": "Compound Sentences",
      "activity_category_id": 14,
      "standard_level": {
        "id": 13,
        "name": "CCSS: Grade 7"
      },
      "standard_level_name": "CCSS: Grade 7",
      "standard_name": "7.1b Choose among simple, compound, complex, and compound-complex sentences to signal differing relationships among ideas",
      "content_partners": [],
      "topics": [
        {
          "name": "Culture",
          "level": 3,
          "id": 3,
          "parent_id": 0
        },
        {
          "name": "Sports",
          "level": 2,
          "id": 52,
          "parent_id": 3
        },
        {
          "name": "Winter Sports",
          "level": 1,
          "id": 83,
          "parent_id": 0
        },
        {
          "name": "The 1980 Olympic Hockey Game",
          "level": 0,
          "id": 134,
          "parent_id": 0
        }
      ],
      "readability_grade_level": "10th-12th",
      "minimum_grade_level": 10,
      "maximum_grade_level": 12
    }
  ],
  "selectedClassrooms": [
    {
      "classroom": {
        "id": 1202571,
        "name": "University",
        "code": "find-donkey",
        "teacher_id": null,
        "created_at": "2022-06-14T16:04:43.376Z",
        "updated_at": "2022-06-14T18:41:45.802Z",
        "clever_id": null,
        "grade": "University",
        "visible": true,
        "google_classroom_id": null,
        "grade_level": null,
        "synced_name": null,
        "emptyClassroomSelected": true
      },
      "students": []
    },
    {
      "classroom": {
        "id": 1202562,
        "name": "Fourth Grade",
        "code": "give-rule",
        "teacher_id": null,
        "created_at": "2022-06-14T16:03:39.231Z",
        "updated_at": "2022-06-14T18:41:45.802Z",
        "clever_id": null,
        "grade": "4",
        "visible": true,
        "google_classroom_id": null,
        "grade_level": null,
        "synced_name": null,
        "emptyClassroomSelected": true
      },
      "students": []
    },
    {
      "classroom": {
        "id": 1198446,
        "name": "Test Class",
        "code": "octave-cakes",
        "teacher_id": null,
        "created_at": "2022-04-12T12:02:00.822Z",
        "updated_at": "2022-06-14T18:41:45.802Z",
        "clever_id": null,
        "grade": "12",
        "visible": true,
        "google_classroom_id": null,
        "grade_level": null,
        "synced_name": null
      },
      "students": [
        {
          "id": 12281381,
          "name": "Colleen Connor",
          "email": "blindinspirationcast@gmail.com",
          "password_digest": "$2a$10$6xbr9p7EEcdSxcbNXUJn4.jklQIYSAL1afIS8XrG15vL12OmFUAx2",
          "role": "student",
          "created_at": "2022-04-13T17:12:23.570Z",
          "updated_at": "2022-04-13T18:23:07.874Z",
          "classcode": null,
          "active": false,
          "username": "cconnor",
          "token": null,
          "ip_address": {
            "family": 2,
            "addr": 1286222463,
            "mask_addr": 4294967295
          },
          "clever_id": null,
          "signed_up_with_google": false,
          "send_newsletter": false,
          "google_id": null,
          "last_sign_in": "2022-04-13T17:12:23.589Z",
          "last_active": "2022-04-13T18:23:07.000Z",
          "stripe_customer_id": null,
          "flags": [],
          "title": null,
          "time_zone": null,
          "account_type": "Student Created Account",
          "isSelected": true
        }
      ]
    }
  ]
}

describe('GradeLevelWarningModal component', () => {

  it('should render', () => {
    const wrapper = mount(<GradeLevelWarningModal {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
