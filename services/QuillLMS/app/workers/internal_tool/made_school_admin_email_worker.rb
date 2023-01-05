# frozen_string_literal: true

class InternalTool::MadeSchoolAdminEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    user = User.find_by(id: user_id)
    school_name = School.find_by(id: school_id)&.name
    puts "user: #{user}"
    puts "school_name: #{school_name}"
    # return unless user && school_name

    user.mailer_user.send_internal_tool_made_school_admin_email(school_name)

    SegmentAnalytics.new.track_school_admin_user(
      user,
      SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN,
      school_name,
      SegmentIo::Properties::STAFF_USER
    )
  end
end
