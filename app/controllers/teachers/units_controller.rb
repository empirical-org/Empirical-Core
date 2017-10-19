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
      Units::Updater.run(units_with_same_name.first.id, params[:unit][:activities], params[:unit][:classrooms])
    else
      Units::Creator.run(current_user, params[:unit][:name], params[:unit][:activities], params[:unit][:classrooms])
    end
    render json: {id: Unit.where(user: current_user).last.id}
  end

  def prohibited_unit_names
    unitNames = current_user.units.map { |u| u.name.downcase }
    unitTemplateNames = UnitTemplate.all.map{ |u| u.name.downcase }
    render json: { prohibitedUnitNames: unitNames.concat(unitTemplateNames) }.to_json
  end

  def last_assigned_unit_id
    render json: {id: Unit.where(user: current_user).last.id}.to_json
  end

  def update
    # unit fix: get all names with pluck
    unit_template_names = UnitTemplate.all.map{ |u| u.name.downcase }
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
      # TODO: change this Unit.find to just params[:id] if/when we change the Units::Updater
      Units::Updater.run(params[:id], activities_data, classroom_activities)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def update_activities
    data = JSON.parse(params[:data],symbolize_names: true)
    classrooms_data = formatted_classrooms_data(params[:id])
    if classrooms_data.any?
      Units::Updater.run(params[:id], data[:activities_data], classrooms_data)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def classrooms_with_students_and_classroom_activities
    unit = Unit.find_by(id: params[:id])
    if unit
      render json: {classrooms: get_classrooms_with_students_and_classroom_activities(params[:id]), unit_name: unit.name}
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
    classroom_activities = ActiveRecord::Base.connection.execute("
      SELECT classroom_activities.id from classroom_activities
      	LEFT JOIN classrooms ON
      		classroom_activities.classroom_id = classrooms.id
      	WHERE classrooms.teacher_id = #{current_user.id.to_i}
      		AND classroom_activities.activity_id = #{activity_id}
      		AND classroom_activities.visible is TRUE").to_a
    if classroom_activities.length == 1
      ca_id = classroom_activities.first["id"]
      lesson_uid = Activity.find(activity_id).uid
      redirect_to "/teachers/classroom_activities/#{ca_id}/launch_lesson/#{lesson_uid}"
    else
      redirect_to "/teachers/classrooms/activity_planner/lessons_for_activity/#{activity_id}"
    end
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
    lesson_units = ActiveRecord::Base.connection.execute("SELECT units.name AS unit_name,
       activities.name AS activity_name,
       activities.supporting_info AS supporting_info,
       classrooms.name AS class_name,
       classrooms.id AS classroom_id,
       activities.activity_classification_id,
       ca.id AS classroom_activity_id,
       ca.unit_id AS unit_id,
       array_length(ca.assigned_student_ids, 1),
       COUNT(DISTINCT sc.student_id) AS class_size,
       ca.due_date,
       activities.id AS activity_id,
       activities.uid as activity_uid,
       SUM(CASE WHEN act_sesh.state = 'finished' THEN 1 ELSE 0 END) AS completed_count,
       SUM(CASE WHEN act_sesh.state = 'started' THEN 1 ELSE 0 END) AS started_count,
       EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
       EXTRACT(EPOCH FROM ca.created_at) AS classroom_activity_created_at
    FROM units
      INNER JOIN classroom_activities AS ca ON ca.unit_id = units.id
      LEFT JOIN activity_sessions AS act_sesh ON act_sesh.classroom_activity_id = ca.id
      INNER JOIN activities ON ca.activity_id = activities.id
      INNER JOIN classrooms ON ca.classroom_id = classrooms.id
      LEFT JOIN students_classrooms AS sc ON sc.classroom_id = ca.classroom_id
    WHERE units.user_id = #{current_user.id}
      AND sc.visible = true
      AND activities.activity_classification_id = 6
      AND classrooms.visible = true
      AND units.visible = true
      AND ca.visible = true
    GROUP BY units.name, units.created_at, ca.id, classrooms.name, classrooms.id, activities.name, activities.activity_classification_id, activities.id, activities.uid").to_a
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

  def edit
    unit = Unit.find(params[:id])
    render json: LessonPlanner::UnitSerializer.new(unit, root: false)
  end

  private

  def unit_params
    params.require(:unit).permit(:id, :create, :name, classrooms: [:id, :all_students, student_ids: []], activities: [:id, :due_date])
  end

  def authorize!
    if params[:id]
      @unit = Unit.find_by(id: params[:id])
      if @unit.nil?
        render json: {errors: 'Unit not found'}, status: 422
      elsif @unit.user != current_user
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
    if report
      completed = "HAVING SUM(CASE WHEN act_sesh.visible = true AND act_sesh.state = 'finished' THEN 1 ELSE 0 END) > 0"
    else
      completed = ''
    end
    ActiveRecord::Base.connection.execute("SELECT units.name AS unit_name,
       activities.name AS activity_name,
       activities.supporting_info AS supporting_info,
       classrooms.name AS class_name,
       classrooms.id AS classroom_id,
       activities.activity_classification_id,
       ca.id AS classroom_activity_id,
       ca.unit_id AS unit_id,
       array_length(ca.assigned_student_ids, 1), COUNT(DISTINCT sc.student_id) AS class_size,
       ca.due_date,
       activities.id AS activity_id,
       activities.uid as activity_uid,
       SUM(CASE WHEN act_sesh.state = 'finished' THEN 1 ELSE 0 END) as completed_count,
       EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
       EXTRACT(EPOCH FROM ca.created_at) AS classroom_activity_created_at
    FROM units
      INNER JOIN classroom_activities AS ca ON ca.unit_id = units.id
      INNER JOIN activities ON ca.activity_id = activities.id
      INNER JOIN classrooms ON ca.classroom_id = classrooms.id
      LEFT JOIN activity_sessions AS act_sesh ON act_sesh.classroom_activity_id = ca.id
      LEFT JOIN students_classrooms AS sc ON sc.classroom_id = ca.classroom_id
    WHERE units.user_id = #{current_user.id}
      AND sc.visible = true
      AND classrooms.visible = true
      AND units.visible = true
      AND ca.visible = true
      GROUP BY units.name, units.created_at, ca.id, classrooms.name, classrooms.id, activities.name, activities.activity_classification_id, activities.id, activities.uid
      #{completed}
      ").to_a
  end

end
