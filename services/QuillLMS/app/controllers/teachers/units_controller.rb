# frozen_string_literal: true

class Teachers::UnitsController < ApplicationController
  include UnitQueries

  respond_to :json
  before_action :teacher!
  before_action :authorize!

  def create
    units_with_same_name = current_user.units_with_same_name(params[:unit][:name])
    includes_ell_starter_diagnostic = params[:unit][:activities].include?({"id"=>1161})

    if units_with_same_name.any?
      activities_data = unit_params[:activities].map(&:to_h)
      classrooms_data = unit_params[:classrooms].map(&:to_h)
      Units::Updater.run(units_with_same_name.first.id, activities_data, classrooms_data, current_user.id)
    else
      Units::Creator.run(current_user, params[:unit][:name], params[:unit][:activities], params[:unit][:classrooms], params[:unit][:unit_template_id], current_user.id)
    end
    if includes_ell_starter_diagnostic
      ELLStarterDiagnosticEmailJob.perform_async(current_user.first_name, current_user.email)
    end
    render json: {id: Unit.where(user: current_user).last.id}
  end

  def prohibited_unit_names
    unit_names = current_user.units.joins(:classrooms).where(classrooms: {visible: true}).pluck(:name).map(&:downcase)
    render json: { prohibitedUnitNames: unit_names }.to_json
  end

  def last_assigned_unit_id
    response = { id: Unit.where(user: current_user).last&.id }
    response = response.merge({ referral_code: current_user.referral_code }) if current_user && current_user.teacher?
    render json: response.to_json
  end

  # rubocop:disable Lint/DuplicateBranch
  def update
    unit_template_names = UnitTemplate.pluck(:name).map(&:downcase)
    if unit_params[:name] && unit_params[:name] === ''
      render json: {errors: { name: 'Unit must have a name'} }, status: 422
    elsif unit_template_names.include?(unit_params[:name].downcase)
      render json: {errors: { name: "Each activity pack needs a unique name. You're already using that name for another activity pack. Please choose a different name."} }, status: 422
    elsif Unit.find(params[:id])&.update(unit_params)
      render json: {}
    else
      render json: {errors: { name: "Each activity pack needs a unique name. You're already using that name for another activity pack. Please choose a different name."} }, status: 422
    end
  end
  # rubocop:enable Lint/DuplicateBranch

  def update_classroom_unit_assigned_students
    activities_data = UnitActivity.where(unit_id: params[:id]).order(:order_number).pluck(:activity_id).map { |id| { id: id } }

    if activities_data.any?
      classroom_data = JSON.parse(params[:unit][:classrooms], symbolize_names: true)
      Units::Updater.run(params[:id], activities_data, classroom_data, current_user.id)
      render json: {}
    else
      render json: {errors: 'Unit can not be found'}, status: 422
    end
  end

  def update_activities
    activities_data = params[:data].permit(activities_data: [:id, :due_date, :publish_date])[:activities_data].map(&:to_h)
    classrooms_data = formatted_classrooms_data(params[:id])

    if classrooms_data.any?
      Units::Updater.run(params[:id], activities_data, classrooms_data, current_user.id)
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
      classroom_unit_id = classroom_units.first["id"]
      redirect_to "/teachers/classroom_units/#{classroom_unit_id}/launch_lesson/#{lesson_uid}"
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
    render json: fetch_diagnostic_units_cache
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

  def close
    unit = Unit.find(params[:id])
    unit.update(open: false)
    ResetLessonCacheWorker.new.perform(current_user.id)
    render json: {}
  end

  def open
    unit = Unit.find(params[:id])
    unit.update(open: true)
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
    classroom_unit = ClassroomUnit.find_by(id: params[:classroom_unit_id])
    return render json: { cumulative_score: 0, completed_count: 0 } unless classroom_unit

    cache_groups = {
      activity: params[:activity_id]
    }

    json = current_user.classroom_unit_cache(classroom_unit, key: 'teachers.units.score_info', groups: cache_groups) do
      completed = ActivitySession.where(
        classroom_unit_id: params[:classroom_unit_id],
        activity_id: params[:activity_id],
        is_final_score: true,
        visible: true
      )

      completed_count = completed.count
      cumulative_score = completed.sum(:percentage) * 100

      {cumulative_score: cumulative_score, completed_count: completed_count}
    end

    render json: json
  end

  private def lessons_with_current_user_and_activity
    RawSqlRunner.execute(
      <<-SQL
        SELECT classroom_units.id
        FROM classroom_units
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.classroom_id = classroom_units.classroom_id
        JOIN units
          ON classroom_units.unit_id = units.id
        JOIN unit_activities
          ON unit_activities.unit_id = units.id
        WHERE classrooms_teachers.user_id = #{current_user.id.to_i}
          AND unit_activities.activity_id = #{ActiveRecord::Base.connection.quote(params[:activity_id])}
          AND classroom_units.visible IS true
      SQL
    ).to_a
  end

  private def unit_params
    params
      .require(:unit)
      .permit(
        :id,
        :create,
        :name,
        :unit_template_id,
        activities: [:id, :due_date, :publish_date],
        classrooms: [:id, :assign_on_join, student_ids: []]
      )
  end

  private def authorize!
    return unless params[:id]

    @unit = Unit.find_by(id: params[:id])
    if @unit.nil?
      render json: {errors: 'Unit not found'}, status: 422
    elsif !current_user.affiliated_with_unit?(@unit.id)
      auth_failed
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

  # rubocop:disable Metrics/CyclomaticComplexity
  private def units_i_teach_own_or_coteach(teach_own_or_coteach, report, lessons)
    # returns an empty array if teach_own_or_coteach_classrooms_array is empty
    teach_own_or_coteach_classrooms_array = current_user.send("classrooms_i_#{teach_own_or_coteach}").map(&:id)

    return [] if teach_own_or_coteach_classrooms_array.empty?

    scores, completed = ''

    if report
      completed = lessons ? "HAVING ca.completed" : "HAVING SUM(CASE WHEN act_sesh.visible = true AND act_sesh.state = 'finished' THEN 1 ELSE 0 END) > 0"
    end

    if lessons
      lessons = "AND activities.activity_classification_id = 6"
    else
      lessons = ''
    end
    teach_own_or_coteach_string = "(#{teach_own_or_coteach_classrooms_array.join(', ')})"

    user_timezone_offset_string = "+ INTERVAL '#{current_user.utc_offset}' SECOND"

    units = RawSqlRunner.execute(
      <<-SQL
        SELECT
          units.name AS unit_name,
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
          ua.due_date #{user_timezone_offset_string} AS due_date,
          CASE
            WHEN ua.publish_date IS NOT NULL
            THEN ua.publish_date #{user_timezone_offset_string}
            ELSE ua.created_at #{user_timezone_offset_string}
          END AS publish_date,
          state.completed,
          ua.publish_date AS ua_publish_date,
          activities.id AS activity_id,
          activities.uid as activity_uid,
          #{scores}
          EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
          EXTRACT(EPOCH FROM ua.created_at) AS unit_activity_created_at,
          #{ActiveRecord::Base.connection.quote(teach_own_or_coteach)} AS teach_own_or_coteach,
          unit_owner.name AS owner_name,
          ua.id AS unit_activity_id,
          units.open AS open,
          CASE
            WHEN unit_owner.id = #{current_user.id} THEN true
            ELSE false
          END AS owned_by_current_user,
          CASE
            WHEN count(pack_sequence_items.id) > 0 THEN true
            ELSE false
          END AS staggered,
          COUNT(DISTINCT CASE WHEN act_sesh.state = 'started' AND act_sesh.visible THEN act_sesh.user_id ELSE NULL END) AS started_count
        FROM units
        JOIN classroom_units AS cu
          ON cu.unit_id = units.id
        JOIN unit_activities AS ua
          ON ua.unit_id = units.id
        JOIN activities
          ON ua.activity_id = activities.id
        JOIN classrooms
          ON cu.classroom_id = classrooms.id
        LEFT JOIN students_classrooms
          ON students_classrooms.classroom_id = classrooms.id
          AND students_classrooms.visible
        LEFT JOIN activity_sessions AS act_sesh
          ON act_sesh.classroom_unit_id = cu.id
          AND act_sesh.activity_id = activities.id
        JOIN users AS unit_owner
          ON unit_owner.id = units.user_id
        LEFT JOIN classroom_unit_activity_states AS state
          ON state.unit_activity_id = ua.id
          AND state.classroom_unit_id = cu.id
        LEFT JOIN pack_sequence_items
          ON cu.id = pack_sequence_items.classroom_unit_id
        WHERE cu.classroom_id IN #{teach_own_or_coteach_string}
          AND classrooms.visible = true
          AND units.visible = true
          AND cu.visible = true
          AND ua.visible = true
          #{lessons}
        GROUP BY
          units.id,
          cu.id, classrooms.name,
          classrooms.id,
          activities.name,
          activities.activity_classification_id,
          activities.id,
          activities.uid,
          unit_owner.name,
          unit_owner.id,
          ua.due_date,
          ua.publish_date,
          ua.created_at,
          unit_activity_id,
          state.completed,
          ua.id
          #{completed}
        ORDER BY
          ua.order_number,
          unit_activity_id
      SQL
    ).to_a

    time_now_utc = Time.now.utc

    units.map do |unit|
      classroom_student_ids = Classroom.find(unit['classroom_id']).students.ids
      if unit['assigned_student_ids'] && classroom_student_ids
        active_assigned_student_ids = JSON.parse(unit['assigned_student_ids']) & classroom_student_ids
        unit['number_of_assigned_students'] = active_assigned_student_ids.length
      else
        unit['number_of_assigned_students'] = 0
      end
      unit['scheduled'] = unit['ua_publish_date'].nil? ? nil : unit['ua_publish_date'].to_time(:utc) >= time_now_utc
      unit
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def fetch_diagnostic_units_cache
    # current_user.all_classrooms_cache(key: 'teachers.classrooms.diagnostic_units') do
    DiagnosticsOrganizedByClassroomFetcher.run(current_user)
    # end
  end
end
