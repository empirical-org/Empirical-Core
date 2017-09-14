class TeacherFixController < ApplicationController
  before_filter :staff!

  def index
  end

  def get_archived_units
    user = User.find_by_username_or_email(params['teacher_identifier'])
    if !user
      render json: {error: 'No such user.'}
    elsif user.role != 'teacher'
      render json: {error: 'This user is not a teacher.'}
    else
      archived_units = Unit.unscoped.where(visible: false, user_id: user.id)
      if archived_units.any?
        render json: {archived_units: archived_units}
      else
        render json: {error: 'This user has no archived units.'}
      end
    end
  end

  def unarchive_units
    unit_ids = params['unit_ids']
    Unit.unscoped.where(id: unit_ids).update_all(visible: true)
    classroom_activities = ClassroomActivity.unscoped.where(unit_id: unit_ids)
    classroom_activities.update_all(visible: true)
    ActivitySession.unscoped.where(classroom_activity_id: classroom_activities.ids).update_all(visible: true)
    render json: {}, status: 200
  end

end
