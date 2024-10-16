# frozen_string_literal: true

class InternalTool::MadeSchoolAdminChangeSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, new_school_id, existing_school_id)
    user = User.find_by(id: user_id)
    new_school = School.find_by(id: new_school_id)
    existing_school = School.find_by(id: existing_school_id)

    return unless user && new_school && existing_school

    if user.is_admin_for_one_school?
      user.mailer_user.send_internal_tool_made_school_admin_change_school_email(new_school, existing_school)
    end

    Analytics::SegmentAnalytics.new.track_school_admin_user(
      user,
      Analytics::SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN,
      new_school.name,
      Analytics::SegmentIo::Properties::STAFF_USER
    )
  end
end
