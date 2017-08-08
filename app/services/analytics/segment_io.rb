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
    CLICK_SIGN_UP ||= 'Click Sign Up'
    TEACHER_ACCOUNT_CREATION ||= 'Teacher created an account'
    TEACHER_SIGNED_UP_FOR_NEWSLETTER ||= 'Teacher signed up for newsletter'
    STUDENT_ACCOUNT_CREATION ||= 'Student created an account'
    TEACHERS_STUDENT_ACCOUNT_CREATION ||= "Teacher's student account created"
    STUDENT_ENTERED_INVALID_CLASSCODE ||= "Student Entered Invalid Classcode"
    TEACHER_SIGNIN ||= 'Teacher signed in'
    STUDENT_SIGNIN ||= 'Student signed in'
    TEACHERS_STUDENT_SIGNIN ||= "Teacher's student signed in"
    CLASSROOM_CREATION ||= 'Teacher created a classroom'
    ACTIVITY_COMPLETION ||= 'Student completed an activity'
    ACTIVITY_ASSIGNMENT ||= 'Teacher assigned an activity'
    ACTIVITY_ASSIGNMENT ||= 'Teacher assigned an activity'
    ASSIGN_FEATURED_ACTIVITY_PACK ||= 'Assign Featured Activity Pack'
    BUILD_YOUR_OWN_ACTIVITY_PACK ||= 'Build Your Own Activity Pack'
    ACCESS_PROGRESS_REPORT ||= 'Teacher opened progress report'
    ASSIGN_DIAGNOSTIC ||= 'Teacher assigned the diagnostic'
    ASSIGN_RECOMMENDATIONS ||= 'Teacher assigned the recommendations'
    ERROR_500 ||= '500 Error'
    BEGAN_TRIAL ||= 'Teacher began trial'
    BEGAN_PREMIUM ||= 'Teacher began trial'
    TEACHER_DELETED_STUDENT_ACCOUNT ||= 'Teacher deleted student account'
    MYSTERY_STUDENT_DELETION ||= 'Mystery student deletion'
    ACTIVITY_SEARCH ||= 'Activity search'
    STUDENT_LOGIN_PDF_DOWNLOAD ||= 'Student login PDF download'
    ASSIGN_QUILL_DIAGNOSTIC_ACTIVITY ||= 'Assign Quill Diagnostic Activity'
    ASSIGN_QUILL_LESSONS_ACTIVITY ||= 'Assign Quill Lessons Activity'
    ASSIGN_QUILL_CONNECT_ACTIVITY ||= 'Assign Quill Connect Activity'
    ASSIGN_QUILL_PROOFREADER_ACTIVITY ||= 'Assign Quill Proofreader Activity'
    ASSIGN_QUILL_GRAMMAR_ACTIVITY ||= 'Assign Quill Grammar Activity'
    COMPLETE_10_ACTIVITIES ||= 'Complete 10 Activities'
    COMPLETE_100_ACTIVITIES ||= 'Complete 100 Activities'
    COMPLETE_250_ACTIVITIES ||= 'Complete 250 Activities'
    COMPLETE_500_ACTIVITIES ||= 'Complete 500 Activities'
    COMPLETE_1000_ACTIVITIES ||= 'Complete 1000 Activities'
    START_TRIAL ||= 'Start Trial'
    VIEW_STANDARD_REPORTS ||= 'View Standard Reports'
    VIEW_CONCEPT_REPORTS ||= 'View Concept Reports'
    DOWNLOAD_CSV_OF_REPORT ||= 'Download CSV of Report'
    ACTIVATE_PREMIUM ||= 'Activate Premium'
  end
end
