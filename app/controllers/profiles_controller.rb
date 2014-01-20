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
    @classroom = current_user.classroom

    @activity_table = {
      'Assigned Lessons' => {},
      'Completed Lessons' => {}
    }

    @classroom.units.each do |unit|
      unit.activities.each do |activity|
        key = if ActivityEnrollment.includes(:classroom_activity)
            .where('classroom_activities.activities_id = ? && classroom_activities.classroom_id = ? && activity_enrollments.user_id = ?',
                   activity.id,
                   @classroom.id,
                   current_user.id)
          'Assigned Lessons'
        else
          'Completed Lessons'
        end

        @activity_table[key][unit.name] ||= {}
        @activity_table[key][unit.name][activity.topic.name] ||= []
        @activity_table[key][unit.name][activity.topic.name] << activity
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
