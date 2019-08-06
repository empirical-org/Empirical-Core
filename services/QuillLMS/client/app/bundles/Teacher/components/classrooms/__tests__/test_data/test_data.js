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
      post_google_classroom_assignments: null
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
      post_google_classroom_assignments: null
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
      post_google_classroom_assignments: null,
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
      post_google_classroom_assignments: null,
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
        post_google_classroom_assignments: null,
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
  post_google_classroom_assignments: null
}
