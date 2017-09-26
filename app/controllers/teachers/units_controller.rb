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
      Units::Updater.run(units_with_same_name.first, params[:unit][:activities], params[:unit][:classrooms])
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
    unit = Unit.find_by_id(params[:id])
    classroom_activities = JSON.parse(params[:unit][:classrooms], symbolize_names: true)
    if unit
      # unit fix
      activities_data = unit.activities.uniq.map { |act| {id: act.id }}
      Units::Updater.run(unit, activities_data, classroom_activities)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def update_activities
    data = JSON.parse(params[:data],symbolize_names: true)
    unit = Unit.find_by_id(params[:id])
    if unit && formatted_classrooms_data(unit).any?
      Units::Updater.run(unit, data[:activities_data], formatted_classrooms_data(unit))
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

  def lesson_info_for_unit_and_activity
    unit = Unit.find_by(id: params[:unit_id])
    activity = Activity.find_by(id: params[:activity_id])
    if unit && activity
      render json: {classroom_activities: get_classroom_activities_for_activity(unit, params[:activity_id]), activity_name: activity.name}
    elsif !activity
      render json: {errors: 'Activity not found'}, status: 422
    else
      render json: {errors: 'Unit not found'}, status: 422
    end
  end

  def launch_lesson_with_activity_id
    unit = Unit.find_by(id: params[:unit_id])
    activity_id = params[:activity_id].to_i
    classroom_activities = unit.classroom_activities.where(activity_id: activity_id)
    if classroom_activities.length == 1
      ca_id = classroom_activities.first.id
      lesson_uid = Activity.find(activity_id).uid
      redirect_to "/teachers/classroom_activities/#{ca_id}/launch_lesson/#{lesson_uid}"
    else
      redirect_to "/teachers/classrooms/activity_planner/lessons/#{activity_id}/unit/#{unit.id}"
    end
  end

  def index
    render json: units.to_json
  end

  def diagnostic_units
    units_with_diagnostics = units.select { |a| a['activity_classification_id'] == '4' }
    render json: units_with_diagnostics.to_json
  end

  def lesson_units
    lesson_units = ActiveRecord::Base.connection.execute("SELECT units.name AS unit_name,
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
       COUNT(CASE WHEN act_sesh.state = 'finished' THEN 1 ELSE NULL END) AS completed_count,
       EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
       EXTRACT(EPOCH FROM ca.created_at) AS classroom_activity_created_at
    FROM units
      INNER JOIN classroom_activities AS ca ON ca.unit_id = units.id
      LEFT JOIN activity_sessions AS act_sesh ON act_sesh.classroom_activity_id = ca.id
      INNER JOIN activities ON ca.activity_id = activities.id
      INNER JOIN classrooms ON ca.classroom_id = classrooms.id
      LEFT JOIN students_classrooms AS sc ON sc.classroom_id = ca.classroom_id
    WHERE units.user_id = #{current_user.id}
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

  def formatted_classrooms_data(unit)
    cas = unit.classroom_activities
    one_ca_per_classroom =  cas.group_by{|class_act| class_act[:classroom_id] }.values.map{ |ca| ca.first }
    one_ca_per_classroom.map{|ca| {id: ca.classroom_id, student_ids: ca.assigned_student_ids}}
  end

  def units
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
       EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
       EXTRACT(EPOCH FROM ca.created_at) AS classroom_activity_created_at
    FROM units
      INNER JOIN classroom_activities AS ca ON ca.unit_id = units.id
      INNER JOIN activities ON ca.activity_id = activities.id
      INNER JOIN classrooms ON ca.classroom_id = classrooms.id
      INNER JOIN students_classrooms AS sc ON sc.classroom_id = ca.classroom_id
    WHERE units.user_id = #{current_user.id}
      AND classrooms.visible = true
      AND units.visible = true
      AND ca.visible = true
    GROUP BY units.name, units.created_at, ca.id, classrooms.name, classrooms.id, activities.name, activities.activity_classification_id, activities.id, activities.uid").to_a
  end

end
