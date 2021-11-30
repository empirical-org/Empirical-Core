import React from "react";

export interface DropdownObject {
  value: string,
  label: string
}

export interface Classroom {
  classroom: {
    clever_id: number,
    code: string,
    created_at: string,
    google_classroom_id: number,
    grade: string,
    grade_level: number,
    id: number,
    name: string,
    synced_name: string,
    teacher_id: number,
    updated_at: string,
    visible: boolean
  }
  students: {
    account_type: string,
    active: boolean,
    classcode: string,
    clever_id: number,
    created_at: string,
    email: string
    flags: string[],
    google_id: number,
    id: number
    ip_address: {
      family: number,
      addr: number,
      mask_addr: number
    }
    last_active: string,
    last_sign_in: string,
    name: string,
    password_digest: string,
    post_google_classroom_assignments: boolean,
    role: string,
    send_newsletter: boolean,
    signed_up_with_google: boolean,
    stripe_customer_id: number,
    time_zone: string,
    title: string,
    token: string,
    updated_at: string,
    username: string,
  }[]
 }

 export interface ClassroomUnit {
  assign_on_join: boolean,
  assigned_student_ids: number[],
  classroom_id: number,
  created_at: string,
  id: number,
  unit_id: number,
  updated_at: string,
  visible: boolean
}

export interface Activity {
  activity_category: { id: number, name: string },
  activity_category_id: number,
  activity_category_name: string,
  activity_classification: {
    alias: string,
    description: string,
    key: string,
    id: number
  }
  anonymous_path: string,
  content_partners: any[],
  description: string,
  flags: string,
  id: number
  name: string,
  readability_grade_level: string,
  standard_level: { id: number, name: string }
  standard_level_name: string,
  standard_name: string,
  topics: {
    id: number,
    level: number,
    name: string,
    parent_id: number
  }[],
  uid: string
}

// activity object from DataTable
export interface ActivityElement extends Activity {
  // activityClassificationId: number,
  activityId?: number,
  // classroomId: number,
  // createdAt: string,
  // created_at: number,
  cuId?: number,
  // dueDate: string
  // dueDatePicker: JSX.Element,
  // id: number,
  // name: string,
  // ownedByCurrentUser: true
  // ownerName: string,
  // removable: true
  // shareActivity: JSX.Element,
  // toolAndNameSection: JSX.Element,
  // uaId: number
}

export interface ActivityPack {
  activities: Activity[],
  activityCount: number,
  name: string
}
