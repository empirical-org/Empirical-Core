class Teachers::UnitsController < ApplicationController
  include Units
  include UnitQueries

  respond_to :json
  before_filter :teacher!
  before_filter :authorize!

  def create
    if params[:unit][:create]
      params[:unit][:classrooms] = JSON.parse(params[:unit][:classrooms])
      params[:unit][:activities] = JSON.parse(params[:unit][:activities])
    end
    units_with_same_name = units_with_same_name_by_current_user(params[:unit][:name], current_user.id)
    if units_with_same_name.any?
      Units::Updater.run(units_with_same_name.first.id, params[:unit][:activities], params[:unit][:classrooms], current_user.id)
    else
      Units::Creator.run(current_user, params[:unit][:name], params[:unit][:activities], params[:unit][:classrooms], params[:unit][:unit_template_id], current_user.id)
    end
    render json: {id: Unit.where(user: current_user).last.id}
  end

  def prohibited_unit_names
    unitNames = current_user.units.pluck(:name).map(&:downcase)
    unit_template_names = UnitTemplate.pluck(:name).map(&:downcase)
    render json: { prohibitedUnitNames: unitNames.concat(unit_template_names) }.to_json
  end

  def last_assigned_unit_id
    render json: {id: Unit.where(user: current_user).last.id}.to_json
  end

  def update
    unit_template_names = UnitTemplate.pluck(:name).map(&:downcase)
    if unit_params[:name] && unit_params[:name] === ''
      render json: {errors: 'Unit must have a name'}, status: 422
    elsif unit_template_names.include?(unit_params[:name].downcase)
      render json: {errors: 'Unit must have a unique name'}, status: 422
    elsif Unit.find(params[:id]).try(:update_attributes, unit_params)
      render json: {}
    else
      render json: {errors: 'Unit must have a unique name'}, status: 422
    end
  end

  def update_classroom_activities_assigned_students
    activities_data = ClassroomActivity.where(unit_id: params[:id]).pluck(:activity_id).map{|id| {id: id}}
    if activities_data.any?
      classroom_activities = JSON.parse(params[:unit][:classrooms], symbolize_names: true)
      Units::Updater.run(params[:id], activities_data, classroom_activities, current_user.id)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def update_activities
    data = JSON.parse(params[:data],symbolize_names: true)
    classrooms_data = formatted_classrooms_data(params[:id])
    if classrooms_data.any?
      Units::Updater.run(params[:id], data[:activities_data], classrooms_data, current_user.id)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def classrooms_with_students_and_classroom_activities
    if @unit.name
      render json: {classrooms: get_classrooms_with_students_and_classroom_activities(@unit, current_user), unit_name: @unit.name}
    else
      render json: {errors: 'Unit not found'}, status: 422
    end
  end

  def lesson_info_for_activity
    activity_id = params[:activity_id].to_i
    classroom_activities = get_classroom_activities_for_activity(activity_id)
    return render json: {errors: 'No activities found'}, status: 422 if classroom_activities.empty?
    render json: {
      classroom_activities: classroom_activities,
      activity_name: Activity.select('name').where("id = #{activity_id}")
    }
  end

  def select_lesson_with_activity_id
    activity_id = params[:activity_id].to_i
    classroom_activities = lessons_with_current_user_and_activity
    if classroom_activities.length == 1
      ca_id = classroom_activities.first["id"]
      redirect_to "/teachers/classroom_activities/#{ca_id}/launch_lesson/#{lesson_uid}"
    else
      redirect_to "/teachers/classrooms/activity_planner/lessons_for_activity/#{activity_id}"
    end
  end

  def lesson_uid
    Activity.find(params[:activity_id].to_i).uid
  end

  def index
    render json: units(params['report']).to_json
  end

  def diagnostic_units
    units_with_diagnostics = units(params['report']).select { |a| a['activity_classification_id'] == '4' }
    render json: units_with_diagnostics.to_json
  end

  # Get all Units containing lessons, and only retrieve the classroom activities for lessons.
  # We use the count to see if we should mark as completed.
  def lesson_units
    units_i_own = units_i_own_or_coteach('own', false, true)
    units_i_coteach = units_i_own_or_coteach('coteach', false, true)
    lesson_units = units_i_own.concat(units_i_coteach)
    render json: lesson_units.to_json
  end

  def hide
    unit = Unit.find(params[:id])
    unit.update(visible: false)
    ArchiveUnitsClassroomActivitiesWorker.perform_async(unit.id)
    render json: {}
  end

  def destroy
    # Unit.find(params[:id]).update(visible: false)
    render json: {}
  end

  private

  def lessons_with_current_user_and_activity
    ActiveRecord::Base.connection.execute("
      SELECT classroom_activities.id from classroom_activities
        LEFT JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classroom_activities.classroom_id
        WHERE classrooms_teachers.user_id = #{current_user.id.to_i}
          AND classroom_activities.activity_id = #{ActiveRecord::Base.sanitize(params[:activity_id])}
          AND classroom_activities.visible is TRUE").to_a
  end

  def unit_params
    params.require(:unit).permit(:id, :create, :name, classrooms: [:id, :all_students, student_ids: []], activities: [:id, :due_date])
  end

  def authorize!
    if params[:id]
      @unit = Unit.find_by(id: params[:id])
      if @unit.nil?
        render json: {errors: 'Unit not found'}, status: 422
      elsif !current_user.affiliated_with_unit(@unit.id)
        auth_failed
      end
    end
  end

  def formatted_classrooms_data(unit_id)
    # potential refactor into SQL
    cas = ClassroomActivity.where(unit_id: unit_id).select(:classroom_id, :assigned_student_ids)
    one_ca_per_classroom =  cas.group_by{|class_act| class_act[:classroom_id] }.values.map{ |ca| ca.first }
    one_ca_per_classroom.map{|ca| {id: ca.classroom_id, student_ids: ca.assigned_student_ids}}
  end

  def units(report)
    units_i_own = units_i_own_or_coteach('own', report, false)
    units_i_coteach = units_i_own_or_coteach('coteach', report, false)
    units_i_own.concat(units_i_coteach)
  end

  def units_i_own_or_coteach(own_or_coteach, report, lessons)
    # returns an empty array if own_or_coteach_classrooms_array is empty
    own_or_coteach_classrooms_array = current_user.send("classrooms_i_#{own_or_coteach}").map(&:id)
    if own_or_coteach_classrooms_array.any?
      if report
        completed = "HAVING SUM(CASE WHEN act_sesh.visible = true AND act_sesh.state = 'finished' THEN 1 ELSE 0 END) > 0"
      else
        completed = ''
      end
      if lessons
        lessons = "AND activities.activity_classification_id = 6"
      else
        lessons = ''
      end
      own_or_coteach_string = "(#{own_or_coteach_classrooms_array.join(', ')})"
      ActiveRecord::Base.connection.execute("SELECT units.name AS unit_name,
         activities.name AS activity_name,
         activities.supporting_info AS supporting_info,
         classrooms.name AS class_name,
         classrooms.id AS classroom_id,
         activities.activity_classification_id,
         ca.id AS classroom_activity_id,
         ca.unit_id AS unit_id,
         COALESCE(array_length(ca.assigned_student_ids, 1), 0) AS number_of_assigned_students,
         COUNT(DISTINCT students_classrooms.id) AS class_size,
         ca.due_date,
         activities.id AS activity_id,
         activities.uid as activity_uid,
         (SELECT COUNT(id) FROM activity_sessions WHERE is_final_score = true AND classroom_activity_id = ca.id AND activity_sessions.visible)  AS completed_count,
         (SELECT (SUM(percentage)*100) FROM activity_sessions WHERE is_final_score = true AND classroom_activity_id = ca.id AND activity_sessions.visible)  AS classroom_cumulative_score,
         (SELECT COUNT(DISTINCT user_id) FROM activity_sessions WHERE state = 'started' AND classroom_activity_id = ca.id AND activity_sessions.visible)  AS started_count,
         EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
         EXTRACT(EPOCH FROM ca.created_at) AS classroom_activity_created_at,
         #{ActiveRecord::Base.sanitize(own_or_coteach)} AS own_or_coteach,
         unit_owner.name AS owner_name,
         CASE WHEN unit_owner.id = #{current_user.id} THEN TRUE ELSE FALSE END AS owned_by_current_user
      FROM units
        INNER JOIN classroom_activities AS ca ON ca.unit_id = units.id
        INNER JOIN activities ON ca.activity_id = activities.id
        INNER JOIN classrooms ON ca.classroom_id = classrooms.id
        LEFT JOIN students_classrooms ON students_classrooms.classroom_id = classrooms.id AND students_classrooms.visible
        LEFT JOIN activity_sessions AS act_sesh ON act_sesh.classroom_activity_id = ca.id
        LEFT JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classrooms.id
        JOIN users AS unit_owner ON unit_owner.id = units.user_id
      WHERE ca.classroom_id IN #{own_or_coteach_string}
        AND classrooms.visible = true
        AND units.visible = true
        AND ca.visible = true
        #{lessons}
        GROUP BY units.name, units.created_at, ca.id, classrooms.name, classrooms.id, activities.name, activities.activity_classification_id, activities.id, activities.uid, unit_owner.name, unit_owner.id
        #{completed}
        ").to_a
    else
      []
    end
  end

end
