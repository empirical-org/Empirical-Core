class Teachers::UnitsController < ApplicationController
  include Units
  include UnitQueries

  respond_to :json
  before_action :teacher!
  before_action :authorize!

  def create
    if params[:unit][:create]
      params[:unit][:classrooms] = JSON.parse(params[:unit][:classrooms])
      params[:unit][:activities] = JSON.parse(params[:unit][:activities])
    end
    units_with_same_name = units_with_same_name_by_current_user(params[:unit][:name], current_user.id)
    includes_ell_starter_diagnostic = params[:unit][:activities].include?({"id"=>1161})
    if units_with_same_name.any?
      Units::Updater.run(units_with_same_name.first.id, params[:unit][:activities], params[:unit][:classrooms], current_user.id)
    else
      Units::Creator.run(current_user, params[:unit][:name], params[:unit][:activities], params[:unit][:classrooms], params[:unit][:unit_template_id], current_user.id)
    end
    if includes_ell_starter_diagnostic
      ELLStarterDiagnosticEmailJob.perform_async(current_user.first_name, current_user.email)
    end
    render json: {id: Unit.where(user: current_user).last.id}
  end

  def prohibited_unit_names
    unit_names = current_user.units.pluck(:name).map(&:downcase)
    render json: { prohibitedUnitNames: unit_names }.to_json
  end

  def last_assigned_unit_id
    response = { id: Unit.where(user: current_user).last&.id }
    response = response.merge({ referral_code: current_user.referral_code }) if current_user && current_user.teacher?
    render json: response.to_json
  end

  def update
    unit_template_names = UnitTemplate.pluck(:name).map(&:downcase)
    if unit_params[:name] && unit_params[:name] === ''
      render json: {errors: { name: 'Unit must have a name'} }, status: 422
    elsif unit_template_names.include?(unit_params[:name].downcase)
      render json: {errors: { name: "Each activity pack needs a unique name. You're already using that name for another activity pack. Please choose a different name."} }, status: 422
    elsif Unit.find(params[:id]).try(:update_attributes, unit_params)
      render json: {}
    else
      render json: {errors: { name: "Each activity pack needs a unique name. You're already using that name for another activity pack. Please choose a different name."} }, status: 422
    end
  end

  def update_classroom_unit_assigned_students
    activities_data = UnitActivity.where(unit_id: params[:id]).pluck(:activity_id).map{|id| {id: id}}
    if activities_data.any?
      classroom_data = JSON.parse(params[:unit][:classrooms], symbolize_names: true)
      Units::Updater.run(params[:id], activities_data, classroom_data, current_user.id)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def update_activities
    data = params[:data]
    classrooms_data = formatted_classrooms_data(params[:id])
    if classrooms_data.any?
      Units::Updater.run(params[:id], data[:activities_data], classrooms_data, current_user.id)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def classrooms_with_students_and_classroom_units
    if @unit.name
      render json: {classrooms: get_classrooms_with_students_and_classroom_units(@unit, current_user), unit_name: @unit.name}
    else
      render json: {errors: 'Unit not found'}, status: 422
    end
  end

  def lesson_info_for_activity
    activity_id = params[:activity_id].to_i
    classroom_units = get_classroom_units_for_activity(activity_id)
    return render json: {errors: 'No activities found'}, status: 422 if classroom_units.empty?
    render json: {
      classroom_units: classroom_units,
      activity_name: Activity.select('name').where("id = #{activity_id}")
    }
  end

  def select_lesson_with_activity_id
    activity_id = params[:activity_id].to_i
    classroom_units = lessons_with_current_user_and_activity
    if classroom_units.length == 1
      cu_id = classroom_units.first["id"]
      redirect_to "/teachers/classroom_units/#{cu_id}/launch_lesson/#{lesson_uid}"
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
    activities_with_calculated_data = diagnostic_assignments.map do |act|
      sorted_individual_assignments = act['individual_assignments'].sort_by { |a| a['assigned_date'] }
      act['individual_assignments'] = sorted_individual_assignments
      act['last_assigned'] = sorted_individual_assignments[-1]['assigned_date']
      all_class_ids = []
      total_assigned = 0
      total_completed = 0
      act['individual_assignments'].each do |assignment|
        all_class_ids.push(assignment['classroom_id'])
        total_assigned += assignment['assigned_count']
        total_completed += assignment['completed_count']
      end
      act['classes_count'] = all_class_ids.uniq.count
      act['total_assigned'] = total_assigned
      act['total_completed'] = total_completed
      act
    end
    render json: activities_with_calculated_data.to_json
  end

  # Get all Units containing lessons, and only retrieve the classroom activities for lessons.
  # We use the count to see if we should mark as completed.
  def lesson_units
    lesson_units_i_teach = units_i_teach_own_or_coteach('teach', false, true)
    render json: lesson_units_i_teach.to_json
  end

  def hide
    unit = Unit.find(params[:id])
    unit.update(visible: false)
    ArchiveUnitsClassroomUnitsWorker.perform_async(unit.id)
    ResetLessonCacheWorker.new.perform(current_user.id)
    render json: {}
  end

  def destroy
    # Unit.find(params[:id]).update(visible: false)
    render json: {}
  end

  # required params
  # :activity_id (in url)
  # :classroom_unit_id
  def score_info
    completed = ActivitySession.where(
      classroom_unit_id: params[:classroom_unit_id],
      activity_id: params[:activity_id],
      is_final_score: true,
      visible: true
    )

    completed_count = completed.count
    cumulative_score = completed.sum(:percentage) * 100

    render json: {cumulative_score: cumulative_score, completed_count: completed_count}
  end

  private def lessons_with_current_user_and_activity
    ActiveRecord::Base.connection.execute("
      SELECT classroom_units.id from classroom_units
        LEFT JOIN classrooms_teachers ON classrooms_teachers.classroom_id = classroom_units.classroom_id
        JOIN units ON classroom_units.unit_id = units.id
        JOIN unit_activities ON unit_activities.unit_id = units.id
        WHERE classrooms_teachers.user_id = #{current_user.id.to_i}
          AND unit_activities.activity_id = #{ActiveRecord::Base.sanitize(params[:activity_id])}
          AND classroom_units.visible is TRUE").to_a
  end

  private def unit_params
    params.require(:unit).permit(:id, :create, :name, classrooms: [:id, :all_students, student_ids: []], activities: [:id, :due_date])
  end

  private def authorize!
    if params[:id]
      @unit = Unit.find_by(id: params[:id])
      if @unit.nil?
        render json: {errors: 'Unit not found'}, status: 422
      elsif !current_user.affiliated_with_unit(@unit.id)
        auth_failed
      end
    end
  end

  private def formatted_classrooms_data(unit_id)
    # potential refactor into SQL
    cus = ClassroomUnit.where(unit_id: unit_id).select(:classroom_id, :assigned_student_ids)
    one_cu_per_classroom =  cus.group_by{|class_unit| class_unit[:classroom_id] }.values.map{ |cu| cu.first }
    one_cu_per_classroom.map{|cu| {id: cu.classroom_id, student_ids: cu.assigned_student_ids}}
  end

  private def units(report)
    units_i_teach_own_or_coteach('teach', report, false)
  end

  private def units_i_teach_own_or_coteach(teach_own_or_coteach, report, lessons)
    # returns an empty array if teach_own_or_coteach_classrooms_array is empty
    teach_own_or_coteach_classrooms_array = current_user.send("classrooms_i_#{teach_own_or_coteach}").map(&:id)
    if teach_own_or_coteach_classrooms_array.any?
      scores, completed, archived_activities = ''
      if report
        completed = lessons ? "HAVING ca.completed" : "HAVING SUM(CASE WHEN act_sesh.visible = true AND act_sesh.state = 'finished' THEN 1 ELSE 0 END) > 0"
      else
        archived_activities = "AND 'archived' != ANY(activities.flags)"
      end
      if lessons
        lessons = "AND activities.activity_classification_id = 6"
      else
        lessons = ''
      end
      teach_own_or_coteach_string = "(#{teach_own_or_coteach_classrooms_array.join(', ')})"
      units = ActiveRecord::Base.connection.execute("SELECT units.name AS unit_name,
         activities.name AS activity_name,
         activities.supporting_info AS supporting_info,
         classrooms.name AS class_name,
         classrooms.id AS classroom_id,
         activities.activity_classification_id,
         ua.order_number,
         cu.id AS classroom_unit_id,
         cu.unit_id AS unit_id,
         array_to_json(cu.assigned_student_ids) AS assigned_student_ids,
         COUNT(DISTINCT students_classrooms.id) AS class_size,
         ua.due_date,
         state.completed,
         activities.id AS activity_id,
         activities.uid as activity_uid,
         #{scores}
         EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
         EXTRACT(EPOCH FROM ua.created_at) AS unit_activity_created_at,
         #{ActiveRecord::Base.sanitize(teach_own_or_coteach)} AS teach_own_or_coteach,
         unit_owner.name AS owner_name,
         ua.id AS unit_activity_id,
         CASE WHEN unit_owner.id = #{current_user.id} THEN TRUE ELSE FALSE END AS owned_by_current_user,
         (SELECT COUNT(DISTINCT user_id) FROM activity_sessions WHERE state = 'started' AND classroom_unit_id = cu.id AND activity_sessions.activity_id = activities.id AND activity_sessions.visible) AS started_count
      FROM units
        INNER JOIN classroom_units AS cu ON cu.unit_id = units.id
        INNER JOIN unit_activities AS ua ON ua.unit_id = units.id
        INNER JOIN activities ON ua.activity_id = activities.id
        INNER JOIN classrooms ON cu.classroom_id = classrooms.id
        LEFT JOIN students_classrooms ON students_classrooms.classroom_id = classrooms.id AND students_classrooms.visible
        LEFT JOIN activity_sessions AS act_sesh ON act_sesh.classroom_unit_id = cu.id AND act_sesh.activity_id = activities.id
        JOIN users AS unit_owner ON unit_owner.id = units.user_id
        LEFT JOIN classroom_unit_activity_states AS state
          ON state.unit_activity_id = ua.id
          AND state.classroom_unit_id = cu.id
      WHERE cu.classroom_id IN #{teach_own_or_coteach_string}
        AND classrooms.visible = true
        AND units.visible = true
        AND cu.visible = true
        AND ua.visible = true
        #{archived_activities}
        #{lessons}
        GROUP BY units.name, units.created_at, cu.id, classrooms.name, classrooms.id, activities.name, activities.activity_classification_id, activities.id, activities.uid, unit_owner.name, unit_owner.id, ua.due_date, ua.created_at, unit_activity_id, state.completed, ua.id
        #{completed}
        ORDER BY ua.order_number, unit_activity_id
        ").to_a
        units.map do |unit|
          classroom_student_ids = Classroom.find(unit['classroom_id']).students.ids
          if unit['assigned_student_ids'] && classroom_student_ids
            active_assigned_student_ids = JSON.parse(unit['assigned_student_ids']) & classroom_student_ids
            unit['number_of_assigned_students'] = active_assigned_student_ids.length
          else
            unit['number_of_assigned_students'] = 0
          end
          unit
        end
    else
      []
    end
  end

  private def diagnostic_unit_records
    diagnostic_activity_ids = ActivityClassification.find_by_key('diagnostic').activity_ids
    records = ClassroomsTeacher.select("
      classrooms.name AS classroom_name,
      activities.name AS activity_name,
      activities.id AS activity_id,
      classroom_units.unit_id AS unit_id,
      units.name AS unit_name,
      classrooms.id AS classroom_id,
      activity_sessions.count AS completed_count,
      array_length(classroom_units.assigned_student_ids, 1) AS assigned_count,
      greatest(unit_activities.created_at, classroom_units.created_at) AS assigned_date
    ")
    .joins("JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = TRUE AND classrooms_teachers.user_id = #{current_user.id}")
    .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id AND classroom_units.visible")
    .joins("JOIN units ON classroom_units.unit_id = units.id AND units.visible")
    .joins("JOIN unit_activities ON unit_activities.unit_id = classroom_units.unit_id AND unit_activities.activity_id IN (#{diagnostic_activity_ids.join(',')}) AND unit_activities.visible")
    .joins("JOIN activities ON unit_activities.activity_id = activities.id")
    .joins("LEFT JOIN activity_sessions ON activity_sessions.activity_id = unit_activities.activity_id AND activity_sessions.classroom_unit_id = classroom_units.id AND activity_sessions.visible AND activity_sessions.is_final_score")
    .group("classrooms.name, activities.name, activities.id, classroom_units.unit_id, units.name, classrooms.id, classroom_units.assigned_student_ids, unit_activities.created_at, classroom_units.created_at")
    .order("greatest(classroom_units.created_at, unit_activities.created_at) DESC")
    records.map do |r|
      {
        "assigned_count" => r['assigned_count'] || 0,
        "completed_count" => r['completed_count'],
        "classroom_name" => r['classroom_name'],
        "activity_name" => r['activity_name'],
        "activity_id" => r['activity_id'],
        "unit_id" => r['unit_id'],
        "unit_name" => r['unit_name'],
        "classroom_id" => r['classroom_id'],
        "assigned_date" => r['assigned_date']
      }
    end
  end

  private def diagnostic_assignments
    assignments = []
    diagnostic_unit_records.each do |r|
      index_of_extant_activity = assignments.find_index { |a| a['id'] == r['activity_id'] }
      if index_of_extant_activity
        assignments[index_of_extant_activity]['individual_assignments'].push(r)
        next
      end
      activity = {
        "name" => r['activity_name'],
        "id" => r["activity_id"],
        "individual_assignments" => [r]
      }
      assignments.push(activity)
    end
    assignments
  end

end
