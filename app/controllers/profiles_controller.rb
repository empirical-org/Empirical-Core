class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    send current_user.role
  end

  def update
    @user = current_user
    @user.update_attributes(user_params)
    redirect_to profile_path
  end

  def user
    student
  end

  def student
    @classroom, @activity_names, @activity_table, @section, @topics = cache('student-profile-vars-'+ current_user.id.to_s, skip_digest: true) do
      classroom = current_user.classroom
      activity_names = []

      if classroom.present?
        activity_table = {
          false => {},
          true => {}
        }

        incomplete_sessions = current_user.activity_sessions.for_classroom(classroom).incomplete.to_a
        completed_sessions = current_user.activity_sessions.for_classroom(classroom).completed.to_a

        classroom.units.each do |unit|
          # raise classroom.classroom_activities.map(&:assigned_student_ids)

          classroom_activities = unit.classroom_activities.joins(:activity).where(<<-SQL, current_user.id)
          classroom_activities.assigned_student_ids IS NULL OR
          classroom_activities.assigned_student_ids = '{}' OR
          ? = ANY (classroom_activities.assigned_student_ids)
          SQL

          classroom_activities.each do |classroom_activity|
            completed_session  =                       completed_sessions.find{|s| s.classroom_activity_id == classroom_activity.id }
            incomplete_session = completed_session || incomplete_sessions.find{|s| s.classroom_activity_id == classroom_activity.id }

            key = !!completed_session

            activity_table[key][unit.name] ||= {}
            activity_table[key][unit.name][classroom_activity.activity.topic.name] ||= []
            activity_table[key][unit.name][classroom_activity.activity.topic.name] << classroom_activity.activity

            activity_names << [classroom_activity.topic.name, classroom_activity.activity, (completed_session || incomplete_session)]
          end
        end

        [classroom, activity_names, activity_table, nil, nil]
      else
        section = Section.find_by_id(params[:section_id]) || Section.first
        topics = section.topics

        [nil, nil, nil, section, topics]
      end
    end

    render :student
  end

  def teacher
    redirect_to teachers_classrooms_path
  end

  def admin
    render :admin
  end

protected
  def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password, :password_confirmation)
  end
end
