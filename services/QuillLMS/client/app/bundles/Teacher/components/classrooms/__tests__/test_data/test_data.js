export const classroomWithStudents = {
  id: 285383,
  name: 'Quill Classroom',
  code: 'demo-2851865',
  teacher_id: null,
  created_at: '2019-05-21T17: 49: 57.695Z',
  updated_at: '2019-05-21T17: 49: 57.695Z',
  clever_id: null,
  grade: '9',
  visible: true,
  google_classroom_id: null,
  grade_level: null,
  students: [
    {
      id: 2851870,
      name: 'Maya Angelou',
      email: 'maya_angelou_demo@quill.org',
      password_digest: '$2a$10$8lVZ3JEY9ghzQi9AYvDjDe7gQ1REsA3BmQS.p.1Qc57lE9VJfDbiO',
      role: 'student',
      created_at: '2019-05-21T17: 49: 59.521Z',
      updated_at: '2019-05-29T19: 56: 16.412Z',
      classcode: null,
      active: false,
      username: 'maya.angelou.285383@demo-teacher',
      token: null,
      ip_address: {
        family: 2,
        addr: 2130706433,
        mask_addr: 4294967295
      },
      clever_id: null,
      signed_up_with_google: false,
      send_newsletter: false,
      google_id: null,
      last_sign_in: '2019-05-29T19: 56: 16.394Z',
      last_active: '2019-05-28T20: 53: 05.000Z',
      stripe_customer_id: null,
      flags: [],
      title: null,
      time_zone: null,
      account_type: 'unknown',
    },
    {
      id: 2851866,
      name: 'William Shakespeare',
      email: null,
      password_digest: '$2a$10$0AxIDK0EyTqkvv0ygC.nGuatwd8EKenwNxElVuOP6FlaZL3KmhKZe',
      role: 'student',
      created_at: '2019-05-21T17: 49: 58.400Z',
      updated_at: '2019-05-21T17: 49: 58.400Z',
      classcode: null,
      active: false,
      username: 'william.shakespeare.285383@demo-teacher',
      token: null,
      ip_address: null,
      clever_id: null,
      signed_up_with_google: false,
      send_newsletter: false,
      google_id: null,
      last_sign_in: null,
      last_active: null,
      stripe_customer_id: null,
      flags: [],
      title: null,
      time_zone: null,
      account_type: 'unknown',
    }
  ],
  teachers: [
    {
      id: 2851865,
      name: 'Demo Teacher',
      email: 'hello+demoteacher@quill.org',
      password_digest: '$2a$10$n8UFjrvzM9N3ZvmMxaKZj.QFTEFrb2AilAgMGHwpD20Q8FQJZehn.',
      role: 'teacher',
      created_at: '2019-05-21T17: 49: 57.461Z',
      updated_at: '2019-07-19T13: 10: 19.194Z',
      classcode: null,
      active: false,
      username: null,
      token: null,
      ip_address: {
        family: 2,
        addr: 2130706433,
        mask_addr: 4294967295
      },
      clever_id: null,
      signed_up_with_google: false,
      send_newsletter: false,
      google_id: null,
      last_sign_in: '2019-07-19T13: 10: 19.172Z',
      last_active: null,
      stripe_customer_id: null,
      flags: [],
      title: null,
      time_zone: null,
      account_type: 'unknown',
      classroom_relation: 'owner',
      status: 'Joined'
    },
    {
      email: 'emiliafree1000@gmail.com',
      classroom_relation: 'co-teacher',
      status: 'Pending',
      id: 73312,
      name: '—'
    },
    {
      email: 'emiliafree@gmail.com',
      classroom_relation: 'co-teacher',
      status: 'Pending',
      id: 73309,
      name: '—'
    }
  ]
}

export const classroomWithoutStudents = {
  id: 285401,
  name: 'Testing',
  code: 'pool-safe',
  teacher_id: null,
  created_at: '2019-07-19T13: 21: 08.151Z',
  updated_at: '2019-07-19T13: 21: 08.151Z',
  clever_id: null,
  grade: '4',
  visible: true,
  google_classroom_id: null,
  grade_level: null,
  students: [],
  teachers: [
    {
      id: 2851865,
      name: 'Demo Teacher',
      email: 'hello+demoteacher@quill.org',
      password_digest: '$2a$10$n8UFjrvzM9N3ZvmMxaKZj.QFTEFrb2AilAgMGHwpD20Q8FQJZehn.',
      role: 'teacher',
      created_at: '2019-05-21T17: 49: 57.461Z',
      updated_at: '2019-07-19T13: 10: 19.194Z',
      classcode: null,
      active: false,
      username: null,
      token: null,
      ip_address: {
        family: 2,
        addr: 2130706433,
        mask_addr: 4294967295
      },
      clever_id: null,
      signed_up_with_google: false,
      send_newsletter: false,
      google_id: null,
      last_sign_in: '2019-07-19T13: 10: 19.172Z',
      last_active: null,
      stripe_customer_id: null,
      flags: [],
      title: null,
      time_zone: null,
      account_type: 'unknown',
      classroom_relation: 'owner',
      status: 'Joined'
    },
    {
      email: 'emiliafree1000@gmail.com',
      classroom_relation: 'co-teacher',
      status: 'Pending',
      id: 73311,
      name: '—'
    },
    {
      email: 'emiliafree@gmail.com',
      classroom_relation: 'co-teacher',
      status: 'Pending',
      id: 73307,
      name: '—'
    }
  ]
}


export const classroomProps = [
  classroomWithoutStudents,
  {
    id: 285400,
    name: 'Empty Class',
    code: 'till-concert',
    teacher_id: null,
    created_at: '2019-07-19T13: 12: 23.375Z',
    updated_at: '2019-07-19T13: 12: 23.375Z',
    clever_id: null,
    grade: '5',
    visible: true,
    google_classroom_id: null,
    grade_level: null,
    students: [],
    teachers: [
      {
        id: 2851865,
        name: 'Demo Teacher',
        email: 'hello+demoteacher@quill.org',
        password_digest: '$2a$10$n8UFjrvzM9N3ZvmMxaKZj.QFTEFrb2AilAgMGHwpD20Q8FQJZehn.',
        role: 'teacher',
        created_at: '2019-05-21T17: 49: 57.461Z',
        updated_at: '2019-07-19T13: 10: 19.194Z',
        classcode: null,
        active: false,
        username: null,
        token: null,
        ip_address: {
          family: 2,
          addr: 2130706433,
          mask_addr: 4294967295
        },
        clever_id: null,
        signed_up_with_google: false,
        send_newsletter: false,
        google_id: null,
        last_sign_in: '2019-07-19T13: 10: 19.172Z',
        last_active: null,
        stripe_customer_id: null,
        flags: [],
        title: null,
        time_zone: null,
        account_type: 'unknown',
        classroom_relation: 'owner',
        status: 'Joined'
      },
      {
        email: 'emiliafree1000@gmail.com',
        classroom_relation: 'co-teacher',
        status: 'Pending',
        id: 73310,
        name: '—'
      },
      {
        email: 'emiliafree@gmail.com',
        classroom_relation: 'co-teacher',
        status: 'Pending',
        id: 73308,
        name: '—'
      }
    ]
  },
  classroomWithStudents
]

export const userProps = {
  id: 2851865,
  name: 'Demo Teacher',
  email: 'hello+demoteacher@quill.org',
  password_digest: '$2a$10$n8UFjrvzM9N3ZvmMxaKZj.QFTEFrb2AilAgMGHwpD20Q8FQJZehn.',
  role: 'teacher',
  created_at: '2019-05-21T17:49:57.461Z',
  updated_at: '2019-07-19T13:10:19.194Z',
  classcode: null,
  active: false,
  username: null,
  token: null,
  ip_address: {
    family: 2,
    addr: 2130706433,
    mask_addr: 4294967295
  },
  clever_id: null,
  signed_up_with_google: false,
  send_newsletter: false,
  google_id: null,
  last_sign_in: '2019-07-19T13:10:19.172Z',
  last_active: null,
  stripe_customer_id: null,
  flags: [],
  title: null,
  time_zone: null,
  account_type: 'unknown',
}

export const googleClassrooms = [
  {
    id: 5038757116,
    name: "Big Class 1",
    ownerId: "102184716939792017986",
    section: "1",
    alreadyImported: true,
    grade: null,
    creationTime: "2017-08-17T21:19:02.818Z",
    studentCount: 0
  },
  {
    id: 1986991936,
    name: "shared class",
    ownerId: "112188393285935083024",
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: "2017-04-24T18:36:15.711Z",
    studentCount: 0
  },
  {
    id: 5145051365,
    name: "test teacher is not a student",
    ownerId: "102184716939792017986",
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: "2017-03-13T16:31:05.568Z",
    studentCount: 9
  },
  {
    id: 5144891078,
    name: "this won't work either",
    ownerId: "102184716939792017986",
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: "2017-03-13T16:14:31.136Z",
    studentCount: 0
  },
  {
    id: 5144690989,
    name: "this will not work",
    ownerId: "102184716939792017986",
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: "2017-03-13T16:07:49.735Z",
    studentCount: 2
  },
  {
    id: 5145161709,
    name: "test teacher is a student",
    ownerId: "102184716939792017986",
    section: null,
    alreadyImported: true,
    grade: null,
    creationTime: "2017-03-13T16:05:33.074Z",
    studentCount: 1
  }
]

export const coteacherInvitations = [
  {
    id: 73330,
    invitation_id: 72173,
    classroom_id: 188628,
    created_at: "2019-08-01T16:05:31.309Z",
    updated_at: "2019-08-01T16:05:31.309Z",
    classroom_name: "2020",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73329,
    invitation_id: 72173,
    classroom_id: 43699,
    created_at: "2019-08-01T16:05:31.207Z",
    updated_at: "2019-08-01T16:05:31.207Z",
    classroom_name: "2019",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73328,
    invitation_id: 72173,
    classroom_id: 220524,
    created_at: "2019-08-01T16:05:31.099Z",
    updated_at: "2019-08-01T16:05:31.099Z",
    classroom_name: "PLP Students",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73327,
    invitation_id: 72173,
    classroom_id: 285377,
    created_at: "2019-08-01T16:05:30.985Z",
    updated_at: "2019-08-01T16:05:30.985Z",
    classroom_name: "Newspaper Publishing 11 - 001 - B. Glover",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73326,
    invitation_id: 72173,
    classroom_id: 285378,
    created_at: "2019-08-01T16:05:30.876Z",
    updated_at: "2019-08-01T16:05:30.876Z",
    classroom_name: "Ninth Grade English - 101 - B. Glover (Section 1)",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73325,
    invitation_id: 72173,
    classroom_id: 285379,
    created_at: "2019-08-01T16:05:30.765Z",
    updated_at: "2019-08-01T16:05:30.765Z",
    classroom_name: "Ninth Grade English - 101 - B. Glover (Section 2)",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73324,
    invitation_id: 72173,
    classroom_id: 285380,
    created_at: "2019-08-01T16:05:30.642Z",
    updated_at: "2019-08-01T16:05:30.642Z",
    classroom_name: "Ninth Grade English - 101 - B. Glover (Section 3)",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73323,
    invitation_id: 72173,
    classroom_id: 285381,
    created_at: "2019-08-01T16:05:30.525Z",
    updated_at: "2019-08-01T16:05:30.525Z",
    classroom_name: "Class 901, Homeroom - 901 - B. Glover (Section 1)",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }, {
    id: 73322,
    invitation_id: 72173,
    classroom_id: 285383,
    created_at: "2019-08-01T16:05:30.313Z",
    updated_at: "2019-08-01T16:05:30.313Z",
    classroom_name: "Quill Classroom",
    inviter_name: "Amber Mitchell",
    inviter_email: "amitchell@ecslions.org"
  }
]

export const cleverClassroomsData = [
  {
    clever_id: "608aceedb9f28409c3320783",
    grade: "1",
    name: "Clever 101",
    students: ["608aca85f0fc4ee5deb62f28", "608ad1f5b3ca107953798b8a", "60994b26e6db39222c0f87be"],
  },
  {
    clever_id: "60944eff243ae50206973692",
    grade: "1",
    name: "Clever 103",
    students: ["608aca85f0fc4ee5deb62f28", "60a682558d5c2d3c431e4d96"],
  }
]
