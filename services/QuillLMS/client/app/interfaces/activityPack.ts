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
  classification: {
    key: string,
    id: number,
    name: string
  },
  description: string,
  id: number,
  level_zero_topic_name: string,
  name: string,
  readability: string,
  standard: {
    id: number,
    name: string,
    standard_category: {
      id: number,
      name: string
    }
  }
  standard_level_name: string
}

// activity object from DataTable
export interface ActivityElement extends Activity {
  activityId?: number,
  cuId?: number
}

export interface ActivityPack {
  activities: Activity[],
  activityCount: number,
  name: string
}
