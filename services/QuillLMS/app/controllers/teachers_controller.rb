class TeachersController < ApplicationController
  before_action :require_user, only: [:classrooms_i_teach_with_students, :classrooms_i_own_with_students]

  def create
    school = School.find_by(id: params[:id])
    # TODO, create auth function that we can use in this controller to verify admin rights.
    if SchoolsAdmins.find_by(school: school, user: current_user)
      @teacher = User.find_by(email: teacher_params[:email])
      if @teacher
        # Teacher exists.
        if SchoolsUsers.find_by(user: @teacher, school: school)
          # Teacher is already in the school, let the admin know.
          message = "#{teacher_params[:first_name]} #{teacher_params[:last_name]} is already registered to #{school.name}."
        else
          # Send invite to the school to the teacher via email.
          message = "An email has been sent to #{teacher_params[:email]} asking them to join #{school.name}."
          JoinSchoolEmailWorker.perform_async(@teacher.id, school.id)
        end
      else
        # Create a new teacher, and automatically join them to the school.
        teacher_attributes = teacher_params.merge({password: teacher_params[:last_name]})
        @teacher = school.users.create(teacher_attributes)
        AccountCreatedEmailWorker.perform_async(@teacher.id, teacher_params[:last_name], current_user.name)
        message = "An email has been sent to #{teacher_params[:email]} asking them to set up their account."
      end
      if @teacher.errors.empty?
        # Return the message to the admin
        render json: {message: message}, status: 200
      else
         # Return errors if there are any.
        render json: @teacher.errors, status: 422
      end
    else
      render json: {errors: 'Something went wrong. If this problem persists, please contact us at hello@quill.org'}, status: 422
    end
  end

  # Called when a teacher accepts an invite to the school. This is sent to them via email.
  def add_school
    if current_user.present? && current_user == User.find_by(id: params[:id])
      # Current user is the user that was invited.
      school = School.find(params[:school_id])
      # User should only belong to one school, so we find their existing link and update the school.
      school_user = SchoolsUsers.find_or_initialize_by(user_id: params[:id])
      school_user.school = school
      if school_user.save
        # redirect to profile with confirmation
        redirect_to profile_path, flash: {notice: "You have successfully joined #{school.name}."}
      else
        # redirect to profile with errors.
        redirect_to profile_path, flash: school_user.errors
      end
    else
      # User is not signed in or they are not the invitee, redirect to sign in page
      redirect_to new_session_path, flash: {error: "You must be signed in to add a school."}
    end
  end

  def admin_dashboard
    if current_user.present? && current_user.admin?
      render 'admin'
    else
      redirect_to profile_path
    end
  end

  def current_user_json
    render json: current_user.to_json
  end

  def classrooms_i_teach_with_students
    render json: {classrooms: current_user.classrooms_i_teach_with_students}
  end

  def classrooms_i_own_with_students
    render json: {classrooms: current_user.classrooms_i_own_with_students}
  end

  def classrooms_i_teach_with_lessons
    if current_user.nil?
      render json: {classrooms: []} and return
    end

    classrooms = Classroom.joins(:activities, :classrooms_teachers)
      .where(unit_activities: {visible: true}, classroom_units: {visible: true},
        classrooms: {visible: true}, units: {visible: true})
      .where(classrooms_teachers: {user_id: current_user.id})
      .where(activities: {activity_classification_id: 6})
      .uniq

    render json: {classrooms: classrooms}
  end

  def update_current_user
    if current_user.update(teacher_params)
      render json: current_user, serializer: UserSerializer
    else
      render json: {errors: current_user.errors}, status: 400
    end
  end

  def completed_diagnostic_unit_info
    begin
      last_finished_diagnostic = current_user.finished_diagnostic_unit_ids_with_classroom_id_and_activity_id.first
      unit_info = { unit_id: last_finished_diagnostic.unit_id, classroom_id: last_finished_diagnostic.classroom_id, activity_id: last_finished_diagnostic.activity_id }
    rescue
      unit_info = {}
    end
    render json: {unit_info: unit_info}
  end

  def diagnostic_info_for_dashboard_mini
    if current_user
      records = ActiveRecord::Base.connection.execute("SELECT cu.id AS classroom_unit_id,
        units.id AS unit_id,
        classroom.id AS classroom_id,
        acts.id AS activity_id,
        actsesh.completed_at FROM classroom_units cu
                 JOIN units ON cu.unit_id = units.id
                 JOIN unit_activities ON units.id = unit_activities.unit_id
                 JOIN classrooms AS classroom ON cu.classroom_id = classroom.id
                 LEFT JOIN activity_sessions AS actsesh ON actsesh.classroom_unit_id = cu.id
                 JOIN activities AS acts ON unit_activities.activity_id = acts.id
                 WHERE units.user_id = #{current_user.id}
                 AND acts.activity_classification_id = 4
                 ORDER BY actsesh.completed_at DESC").to_a
      if !records.empty?
        most_recently_completed = records.find { |r| !r['completed_at'].nil? }
        # checks to see if the diagnostic was completed within a week
        if most_recently_completed && 1.week.ago < most_recently_completed['completed_at']
          number_of_finished_students = ActiveRecord::Base.connection.execute("SELECT COUNT(actsesh.user_id) FROM activity_sessions actsesh
                                JOIN classroom_units AS cu ON actsesh.classroom_unit_id = cu.id
                                WHERE cu.id = #{ActiveRecord::Base.sanitize(most_recently_completed['classroom_unit_id'])}
                                AND actsesh.state = 'finished'
                                AND actsesh.visible = 'true'
                                AND cu.visible = 'true'
                                GROUP BY actsesh.user_id
                                ").to_a.length
          render json: {status: 'recently completed', unit_info: most_recently_completed, number_of_finished_students: number_of_finished_students }
        elsif most_recently_completed
          render json: {status: 'completed'}
        else
          render json: {status: 'assigned'}
        end
      else
        render json: {status: 'unassigned'}
      end
    else
      render json: {}
    end
  end

  private

  def teacher_params
    params.require(:teacher).permit(:admin_id, :first_name, :last_name, :email)
           .merge({role: 'teacher'})

  end

end
