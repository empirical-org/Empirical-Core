# frozen_string_literal: true

module Analytics
  module SegmentIo
    class << self
      attr_accessor :configuration
    end

    class Configuration
      attr_accessor :write_key
    end

    def self.configure
      self.configuration ||= Configuration.new
      yield(configuration)
    end

    module BackgroundEvents
      TEACHER_ACCOUNT_CREATION = 'Teacher created an account'
      TEACHER_SIGNED_UP_FOR_NEWSLETTER = 'Teacher signed up for newsletter'
      TEACHERS_STUDENT_ACCOUNT_CREATION = "Teacher's student account created"
      TEACHER_SIGNIN = 'Teacher signed in'
      TEACHER_GOOGLE_AND_CLEVER = 'Teacher attempted to connect to Google and Clever'
      TEACHERS_STUDENT_SIGNIN = "Teacher's student signed in"
      CLASSROOM_CREATION = 'Teacher created a classroom'
      ACTIVITY_COMPLETION = 'Student completed an activity'
      ACTIVITY_PACK_ASSIGNMENT = 'Teacher assigned an activity pack'
      ACTIVITY_PACK_COMPLETION = 'Student completed an activity pack'
      ACTIVITY_ASSIGNMENT = 'Teacher assigned an activity'
      DIAGNOSTIC_ASSIGNMENT = 'Teacher assigned a diagnostic'
      ACCESS_PROGRESS_REPORT = 'Teacher opened progress report'
      ASSIGN_RECOMMENDATIONS = 'Teacher assigned a recommended activity pack'
      ASSIGN_ALL_RECOMMENDATIONS = 'Teacher assigned all recommended activity packs'
      ERROR_500 = '500 Error'
      TEACHER_BEGAN_PREMIUM = 'Teacher began premium'
      TEACHER_DELETED_STUDENT_ACCOUNT = 'Teacher deleted student account'
      MYSTERY_STUDENT_DELETION = 'Mystery student deletion'
      ACTIVITY_SEARCH = 'Activity search'
      STUDENT_LOGIN_PDF_DOWNLOAD = 'Student login PDF download'
      REFERRAL_INVITED = "A new teacher signed up from this teacher's referral link"
      REFERRAL_ACTIVATED = "One of this teacher's referrals is now active"
      COTEACHER_INVITATION = 'Teacher invited a coteacher'
      COTEACHER_ACCEPTANCE = 'Teacher accepted coteacher invitation'
      TRANSFER_OWNERSHIP = 'Teacher transferred ownership of a classroom'
      VIEWED_AS_STUDENT = 'Teacher viewed Quill as a student'
      VIEWED_DEMO = 'User logged into Demo account'
      PREVIEWED_ACTIVITY = 'Teacher previewed an activity'
      TEACHER_COMPLETED_ONBOARDING_CHECKLIST = 'Teacher completed onboarding checklist'
      TEACHER_SCHOOL_NOT_LISTED = 'Teacher school not listed'
      # renewing subscriptions
      TEACHER_SUB_WILL_RENEW_IN_30 = 'Teacher Premium Renews in 30 Days | Automatic Renewal On'
      SCHOOL_SUB_WILL_RENEW_IN_30 = 'School Premium Renews in 30 Days | Automatic Renewal On'
      TEACHER_SUB_WILL_RENEW_IN_7 = 'Teacher Premium Renews in 7 Days | Automatic Renewal On'
      SCHOOL_SUB_WILL_RENEW_IN_7 = 'School Premium Renews in 7 Days | Automatic Renewal On'
      # expiring subscriptions
      TEACHER_SUB_WILL_EXPIRE_IN_30 = 'Teacher Premium Expires in 30 Days | Automatic Renewal Off'
      SCHOOL_SUB_WILL_EXPIRE_IN_30 = 'School Premium Expires in 30 Days | Automatic Renewal Off'
      TEACHER_SUB_WILL_EXPIRE_IN_14 = 'Teacher Premium Expires in 14 Days | Automatic Renewal Off'
      SCHOOL_SUB_WILL_EXPIRE_IN_14 = 'School Premium Expires in 14 Days | Automatic Renewal Off'
      # admin users
      ADMIN_CREATED_TEACHER_ACCOUNT = 'Admin created a teacher account'
      ADMIN_CREATED_SCHOOL_ADMIN_ACCOUNT = 'Admin created a school admin account'
      ADMIN_SENT_LINK_REQUEST = 'Admin sent a link request to teacher'
      ADMIN_MADE_EXISTING_USER_SCHOOL_ADMIN = 'Admin made an existing user a school admin'
      STAFF_CREATED_SCHOOL_ADMIN_ACCOUNT = 'Quill team member created a school admin account'
      STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN = 'Quill team member made an existing user a school admin'
      STAFF_CREATED_DISTRICT_ADMIN_ACCOUNT = 'Quill team member created a district admin account'
      STAFF_MADE_EXISTING_USER_DISTRICT_ADMIN = 'Quill team member made an existing user district admin'
      # teacher requested admin upgrade from existing admins
      ADMIN_RECEIVED_ADMIN_UPGRADE_REQUEST_FROM_TEACHER = 'Admin received request from teacher to become admin'
      TEACHER_REQUESTED_TO_BECOME_ADMIN = 'Teacher requested to become admin'
      TEACHER_APPROVED_TO_BECOME_ADMIN = 'Teacher’s request to become admin approved'
      TEACHER_DENIED_TO_BECOME_ADMIN = 'Teacher’s request to become admin denied'
      # new user requested admin upgrade from existing admins
      ADMIN_RECEIVED_ADMIN_UPGRADE_REQUEST_FROM_NEW_USER = 'Admin received request from new user to become admin'
      NEW_USER_REQUESTED_TO_BECOME_ADMIN = 'New user requested to become admin'
      NEW_USER_APPROVED_TO_BECOME_ADMIN = "New user's request to become admin approved"
      NEW_USER_DENIED_TO_BECOME_ADMIN = "New user's request to become admin denied"
      # teacher invited admin
      ADMIN_INVITED_BY_TEACHER = 'Admin invited by teacher'
      TEACHER_INVITED_ADMIN = 'Teacher invited admin'
      # Google user has password added
      GOOGLE_STUDENT_SET_PASSWORD = 'Google user set a password | student'
      GOOGLE_TEACHER_SET_PASSWORD = 'Google user set a password | teacher'
    end

    module Properties
      STAFF_USER = 'The Quill Team'
    end

    module Events
      # New events that may overlap with those defined in a front-end React module
    end
  end
end
