# frozen_string_literal: true

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
    TEACHER_SUB_WILL_RENEW = 'Teacher Premium Renews in 30 Days | Automatic Renewal On'
    SCHOOL_SUB_WILL_RENEW = 'School Premium Renews in 30 Days | Automatic Renewal On'
    TEACHER_SUB_WILL_EXPIRE_IN_30 = 'Teacher Premium Expires in 30 Days | Automatic Renewal Off'
    SCHOOL_SUB_WILL_EXPIRE_IN_30 = 'School Premium Expires in 30 Days | Automatic Renewal Off'
    TEACHER_SUB_WILL_EXPIRE_IN_14 = 'Teacher Premium Expires in 14 Days | Automatic Renewal Off'
    SCHOOL_SUB_WILL_EXPIRE_IN_14 = 'School Premium Expires in 14 Days | Automatic Renewal Off'
  end

  module Events
    # New events that may overlap with those defined in a front-end React module
  end

end
