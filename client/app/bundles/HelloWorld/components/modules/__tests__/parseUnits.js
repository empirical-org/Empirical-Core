import {
  orderUnits, generateNewCaUnit, assignedStudentCount, classroomActivityData
} from '../parseUnits.js'

const sampleUnit = {
  "classrooms": [{
    "name": "class1",
    "totalStudentCount": "1",
    "assignedStudentCount": "1"
  }],
  "classroomActivities": [
    ["437", {
      "name": "Compound Subjects, Objects, Predicates",
      "activityId": "437",
      "created_at": "1490822326.02562",
      "caId": "1081446",
      "activityClassificationId": "5",
      "classroomId": "52",
      "ownedByCurrentUser": true,
      "ownerName": "Mr. Jones",
      "dueDate": null,
      "numberOfAssignedStudents": "1",
      "completedCount": "1",
      "cumulativeScore": "39"
    }]
  ],
  "unitId": "96518",
  "unitCreated": "1490822326.00548",
  "unitName": "tes"
}

describe('orderUnits', () => {

  const unitArg = {
    "96518": sampleUnit,
    "102040": {
      "classrooms": [{
        "name": "class1",
        "totalStudentCount": "1",
        "assignedStudentCount": "1"
      }, {
        "name": "class9",
        "totalStudentCount": "1",
        "assignedStudentCount": "1"
      }, {
        "name": "class10",
        "totalStudentCount": "5",
        "assignedStudentCount": "5"
      }, {
        "name": "class13",
        "totalStudentCount": "3",
        "assignedStudentCount": "3"
      }],
      "classroomActivities": [
        ["438", {
          "name": "Adverbs of Manner 1 (Starter)",
          "caId": "1147201",
          "activityId": "438",
          "created_at": "1492541850.9545",
          "activityClassificationId": "5",
          "classroomId": "64",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "3",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["439", {
          "name": "Adverbs of Manner 2 (Starter)",
          "caId": "1147202",
          "activityId": "439",
          "created_at": "1492541850.98305",
          "activityClassificationId": "5",
          "classroomId": "64",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "3",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["440", {
          "name": "Adverbs of Manner 3 (Starter)",
          "caId": "1147203",
          "activityId": "440",
          "created_at": "1492541851.0278",
          "activityClassificationId": "5",
          "classroomId": "64",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "3",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["441", {
          "name": "Adverbs of Manner (Intermediate)",
          "caId": "1147204",
          "activityId": "441",
          "created_at": "1492541851.07455",
          "activityClassificationId": "5",
          "classroomId": "64",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "3",
          "cumulativeScore": 0,
          "completedCount": 0
        }]
      ],
      "unitId": "102040",
      "unitCreated": "1492541847.15404",
      "unitName": "Adverbs of Manner Independent Practice"
    },
    "102051": {
      "classrooms": [{
        "name": "class13",
        "totalStudentCount": "3",
        "assignedStudentCount": "3"
      }, {
        "name": "class1",
        "totalStudentCount": "1",
        "assignedStudentCount": "1"
      }, {
        "name": "class9",
        "totalStudentCount": "1",
        "assignedStudentCount": "1"
      }, {
        "name": "class10",
        "totalStudentCount": "5",
        "assignedStudentCount": "5"
      }],
      "classroomActivities": [
        ["477", {
          "name": "The Stamp Act",
          "caId": "1147331",
          "activityId": "477",
          "created_at": "1492542191.00146",
          "activityClassificationId": "5",
          "classroomId": "61",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "5",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["478", {
          "name": "The Boston Tea Party",
          "caId": "1147332",
          "activityId": "478",
          "created_at": "1492542192.08637",
          "activityClassificationId": "5",
          "classroomId": "61",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "5",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["481", {
          "name": "The Sons of Liberty",
          "caId": "1147333",
          "activityId": "481",
          "created_at": "1492542192.63421",
          "activityClassificationId": "1",
          "classroomId": "61",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "5",
          "cumulativeScore": 0,
          "completedCount": 0
        }],
        ["476", {
          "name": "The Boston Massacre",
          "caId": "1147334",
          "activityId": "476",
          "created_at": "1492542193.11382",
          "activityClassificationId": "5",
          "classroomId": "61",
          "ownedByCurrentUser": true,
          "ownerName": "Mr. Jones",
          "dueDate": null,
          "numberOfAssignedStudents": "5",
          "cumulativeScore": 0,
          "completedCount": 0
        }]
      ],
      "unitId": "102051",
      "unitCreated": "1492542144.54131",
      "unitName": "The American Revolution"
    }
  }

  const orderedUnits =
  [{
    "classrooms": [{
      "name": "class1",
      "totalStudentCount": "1",
      "assignedStudentCount": "1"
    }],
    "classroomActivities": [
      ["437", {
        "name": "Compound Subjects, Objects, Predicates",
        "activityId": "437",
        "created_at": "1490822326.02562",
        "caId": "1081446",
        "activityClassificationId": "5",
        "classroomId": "52",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "1",
        "completedCount": "1",
        "cumulativeScore": "39"
      }]
    ],
    "unitId": "96518",
    "unitCreated": "1490822326.00548",
    "unitName": "tes"
  }, {
    "classrooms": [{
      "name": "class1",
      "totalStudentCount": "1",
      "assignedStudentCount": "1"
    }, {
      "name": "class9",
      "totalStudentCount": "1",
      "assignedStudentCount": "1"
    }, {
      "name": "class10",
      "totalStudentCount": "5",
      "assignedStudentCount": "5"
    }, {
      "name": "class13",
      "totalStudentCount": "3",
      "assignedStudentCount": "3"
    }],
    "classroomActivities": [
      ["438", {
        "name": "Adverbs of Manner 1 (Starter)",
        "caId": "1147201",
        "activityId": "438",
        "created_at": "1492541850.9545",
        "activityClassificationId": "5",
        "classroomId": "64",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "3",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["439", {
        "name": "Adverbs of Manner 2 (Starter)",
        "caId": "1147202",
        "activityId": "439",
        "created_at": "1492541850.98305",
        "activityClassificationId": "5",
        "classroomId": "64",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "3",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["440", {
        "name": "Adverbs of Manner 3 (Starter)",
        "caId": "1147203",
        "activityId": "440",
        "created_at": "1492541851.0278",
        "activityClassificationId": "5",
        "classroomId": "64",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "3",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["441", {
        "name": "Adverbs of Manner (Intermediate)",
        "caId": "1147204",
        "activityId": "441",
        "created_at": "1492541851.07455",
        "activityClassificationId": "5",
        "classroomId": "64",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "3",
        "cumulativeScore": 0,
        "completedCount": 0
      }]
    ],
    "unitId": "102040",
    "unitCreated": "1492541847.15404",
    "unitName": "Adverbs of Manner Independent Practice"
  }, {
    "classrooms": [{
      "name": "class13",
      "totalStudentCount": "3",
      "assignedStudentCount": "3"
    }, {
      "name": "class1",
      "totalStudentCount": "1",
      "assignedStudentCount": "1"
    }, {
      "name": "class9",
      "totalStudentCount": "1",
      "assignedStudentCount": "1"
    }, {
      "name": "class10",
      "totalStudentCount": "5",
      "assignedStudentCount": "5"
    }],
    "classroomActivities": [
      ["477", {
        "name": "The Stamp Act",
        "caId": "1147331",
        "activityId": "477",
        "created_at": "1492542191.00146",
        "activityClassificationId": "5",
        "classroomId": "61",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "5",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["478", {
        "name": "The Boston Tea Party",
        "caId": "1147332",
        "activityId": "478",
        "created_at": "1492542192.08637",
        "activityClassificationId": "5",
        "classroomId": "61",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "5",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["481", {
        "name": "The Sons of Liberty",
        "caId": "1147333",
        "activityId": "481",
        "created_at": "1492542192.63421",
        "activityClassificationId": "1",
        "classroomId": "61",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "5",
        "cumulativeScore": 0,
        "completedCount": 0
      }],
      ["476", {
        "name": "The Boston Massacre",
        "caId": "1147334",
        "activityId": "476",
        "created_at": "1492542193.11382",
        "activityClassificationId": "5",
        "classroomId": "61",
        "ownedByCurrentUser": true,
        "ownerName": "Mr. Jones",
        "dueDate": null,
        "numberOfAssignedStudents": "5",
        "cumulativeScore": 0,
        "completedCount": 0
      }]
    ],
    "unitId": "102051",
    "unitCreated": "1492542144.54131",
    "unitName": "The American Revolution"
  }]


  it('converts the units object into an array of units in the correct order', () => {
    expect(orderUnits(unitArg)).toEqual(orderedUnits)
  })

})

describe('assignedStudentCount', () => {

 const classObj = {number_of_assigned_students: 6, class_size: 10}


 it('returns number_of_assigned_students property if it exists', ()=>{

   expect(assignedStudentCount(classObj)).toEqual(6)
 })

 it('returns class_size property if number_of_assigned_students if it exists', ()=>{
   delete classObj.number_of_assigned_students;
   expect(assignedStudentCount(classObj)).toEqual(10)
 })
})

describe('classroomActivityData', () => {

  const u = sampleUnit;

  it('returns an object with with the correct unit info', ()=> {
    expect(classroomActivityData(u)).toEqual(
      expect.objectContaining(
        {
          name: u.activity_name,
          caId: u.classroom_activity_id,
          activityId: u.activity_id,
          created_at: u.classroom_activity_created_at,
          activityClassificationId: u.activity_classification_id,
          classroomId: u.classroom_id,
          ownedByCurrentUser: u.owned_by_current_user === 't',
          ownerName: u.owner_name,
          createdAt: u.ca_created_at,
          dueDate: u.due_date
        }
      )
    )
  })
})
