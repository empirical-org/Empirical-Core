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

  module Events
    CLICK_SIGN_UP = 'Click Sign Up'
    TEACHER_ACCOUNT_CREATION = 'Teacher created an account'
    TEACHER_SIGNED_UP_FOR_NEWSLETTER = 'Teacher signed up for newsletter'
    STUDENT_ACCOUNT_CREATION = 'Student created an account'
    TEACHERS_STUDENT_ACCOUNT_CREATION = "Teacher's student account created"
    STUDENT_ENTERED_INVALID_CLASSCODE = "Student Entered Invalid Classcode"
    TEACHER_SIGNIN = 'Teacher signed in'
    STUDENT_SIGNIN = 'Student signed in'
    TEACHERS_STUDENT_SIGNIN = "Teacher's student signed in"
    CLASSROOM_CREATION = 'Teacher created a classroom'
    ACTIVITY_COMPLETION = 'Student completed an activity'
    ACTIVITY_ASSIGNMENT = 'Teacher assigned an activity'
    USER_COMPLETED_MILESTONE = 'User Completed Milestone'
    ASSIGN_FEATURED_ACTIVITY_PACK = 'Assign Featured Activity Pack'
    BUILD_YOUR_OWN_ACTIVITY_PACK = 'Build Your Own Activity Pack'
    ACCESS_PROGRESS_REPORT = 'Teacher opened progress report'
    ASSIGN_DIAGNOSTIC = 'Teacher assigned the diagnostic'
    ASSIGN_RECOMMENDATIONS = 'Teacher assigned the recommendations'
    ERROR_500 = '500 Error'
    BEGAN_TRIAL = 'Teacher began trial'
    BEGAN_PREMIUM = 'Teacher began trial'
    TEACHER_DELETED_STUDENT_ACCOUNT = 'Teacher deleted student account'
    MYSTERY_STUDENT_DELETION = 'Mystery student deletion'
    ACTIVITY_SEARCH = 'Activity search'
    STUDENT_LOGIN_PDF_DOWNLOAD = 'Student login PDF download'
    REFERRAL_INVITED = "A new teacher signed up from this teacher's referral link"
    REFERRAL_ACTIVATED = "One of this teacher's referrals is now active"
    COTEACHER_INVITATION = 'Teacher invited a coteacher'
    TRANSFER_OWNERSHIP = 'Teacher transferred ownership of a classroom'

    # New events created as part of a sort of analytics reboot.
    # Some of these may overlap with already-defined events, but we're currently
    # comfortable with a discontinuity.
    # Proposed event naming convention: UserType.SourceLocation.SpecificTarget.UserAction
    ANON_HOMEPAGE_HEADER_CLICK_SIGN_UP = "Anonymous.Homepage.Header.ClickSignUp"
    ANON_HOMEPAGE_MAIN_CTA_CLICK_SIGN_UP = "Anonymous.Homepage.MainCTA.ClickSignUp"
    ANON_HOMEPAGE_FINAL_CTA_CLICK_SIGN_UP = "Anonymous.Homepage.FinalCTA.ClickSignUp"
    ANON_HOMEPAGE_HEADER_CLICK_LOG_IN = "Anonymous.Homepage.Header.ClickLogIn"
  end
end
