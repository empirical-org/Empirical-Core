# frozen_string_literal: true

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

  # rubocop:disable Lint/DuplicateBranch
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
    params.require(:unit).permit(:id, :create, :name, classrooms: [:id, :all_students, student_ids: []], activities: [:id, :due_date])
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
          ua.due_date,
          state.completed,
          activities.id AS activity_id,
          activities.uid as activity_uid,
          #{scores}
          EXTRACT(EPOCH FROM units.created_at) AS unit_created_at,
          EXTRACT(EPOCH FROM ua.created_at) AS unit_activity_created_at,
          #{ActiveRecord::Base.connection.quote(teach_own_or_coteach)} AS teach_own_or_coteach,
          unit_owner.name AS owner_name,
          ua.id AS unit_activity_id,
          CASE
            WHEN unit_owner.id = #{current_user.id} THEN true
            ELSE false
          END AS owned_by_current_user,
          (
            SELECT COUNT(DISTINCT user_id)
            FROM activity_sessions
            WHERE state = 'started'
              AND classroom_unit_id = cu.id
              AND activity_sessions.activity_id = activities.id
              AND activity_sessions.visible
          ) AS started_count
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
        WHERE cu.classroom_id IN #{teach_own_or_coteach_string}
          AND classrooms.visible = true
          AND units.visible = true
          AND cu.visible = true
          AND ua.visible = true
          #{archived_activities}
          #{lessons}
        GROUP BY
          units.name,
          units.created_at,
          cu.id, classrooms.name,
          classrooms.id,
          activities.name,
          activities.activity_classification_id,
          activities.id,
          activities.uid,
          unit_owner.name,
          unit_owner.id,
          ua.due_date,
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
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def diagnostic_unit_records
    diagnostic_activity_ids = ActivityClassification.find_by_key('diagnostic').activity_ids
    records = ClassroomsTeacher.select("
      classrooms.name AS classroom_name,
      activities.name AS activity_name,
      activities.id AS activity_id,
      classroom_units.unit_id AS unit_id,
      units.name AS unit_name,
      classrooms.id AS classroom_id,
      classroom_units.assigned_student_ids AS assigned_student_ids,
      greatest(unit_activities.created_at, classroom_units.created_at) AS assigned_date,
      activities.follow_up_activity_id AS post_test_id,
      classroom_units.id AS classroom_unit_id
    ")
    .joins("JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = TRUE AND classrooms_teachers.user_id = #{current_user.id}")
    .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id AND classroom_units.visible")
    .joins("JOIN units ON classroom_units.unit_id = units.id AND units.visible")
    .joins("JOIN unit_activities ON unit_activities.unit_id = classroom_units.unit_id AND unit_activities.activity_id IN (#{diagnostic_activity_ids.join(',')}) AND unit_activities.visible")
    .joins("JOIN activities ON unit_activities.activity_id = activities.id")
    .group("classrooms.name, activities.name, activities.id, classroom_units.unit_id, classroom_units.id, units.name, classrooms.id, classroom_units.assigned_student_ids, unit_activities.created_at, classroom_units.created_at")
    .order(Arel.sql("classrooms.name, greatest(classroom_units.created_at, unit_activities.created_at) DESC"))

    records.map do |r|
      {
        "assigned_student_ids" => r['assigned_student_ids'] || [],
        "classroom_name" => r['classroom_name'],
        "activity_name" => r['activity_name'],
        "activity_id" => r['activity_id'],
        "unit_id" => r['unit_id'],
        "unit_name" => r['unit_name'],
        "classroom_id" => r['classroom_id'],
        "assigned_date" => r['assigned_date'],
        "post_test_id" => r['post_test_id'],
        "classroom_unit_id" => r['classroom_unit_id']
      }
    end
  end

  private def fetch_diagnostic_units_cache
    current_user.all_classrooms_cache(key: 'teachers.classrooms.diagnostic_units') do
      diagnostics_organized_by_classroom
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def diagnostics_organized_by_classroom
    classrooms = []
    diagnostic_records = diagnostic_unit_records
    post_test_ids = diagnostic_records.map { |r| r['post_test_id'] }.compact
    diagnostic_records.each do |record|
      next if post_test_ids.include?(record['activity_id'])

      index_of_existing_classroom = classrooms.find_index { |c| c['id'] == record['classroom_id'] }
      name = grouped_name(record)

      next if record['post_test_id'] && index_of_existing_classroom && classrooms[index_of_existing_classroom]['diagnostics'].find { |diagnostic| diagnostic[:name] == name }

      grouped_record = {
        name: name,
        pre: record
      }

      if record['post_test_id']
        post_test = record_with_aggregated_activity_sessions(diagnostic_records, record['post_test_id'], record['classroom_id'], record['activity_id'])
        grouped_record[:post] = post_test || { activity_name: Activity.find_by_id(record['post_test_id'])&.name, unit_template_id: ActivitiesUnitTemplate.find_by_activity_id(record['post_test_id'])&.unit_template_id }
        grouped_record[:pre] = record_with_aggregated_activity_sessions(diagnostic_records, record['activity_id'], record['classroom_id'], nil)
      else
        grouped_record[:pre]['completed_count'] = ActivitySession.where(activity_id: record['activity_id'], classroom_unit_id: record['classroom_unit_id'], state: 'finished', user_id: record['assigned_student_ids']).size
        grouped_record[:pre]['assigned_count'] = record['assigned_student_ids'].size
      end
      if index_of_existing_classroom
        classrooms[index_of_existing_classroom]['diagnostics'].push(grouped_record)
        next
      end
      classroom = {
        "name" => record['classroom_name'],
        "id" => record['classroom_id'],
        "diagnostics" => [grouped_record]
      }
      classrooms.push(classroom)
    end
    classrooms.to_json
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  private def record_with_aggregated_activity_sessions(diagnostic_records, activity_id, classroom_id, pre_test_activity_id)
    records = diagnostic_records.select { |record| record['activity_id'] == activity_id && record['classroom_id'] == classroom_id }
    return if records.empty?

    classroom_unit_ids = records.map { |record| record['classroom_unit_id'] }
    assigned_student_ids = records.map { |r| r['assigned_student_ids'] }.flatten.uniq
    activity_sessions = ActivitySession
      .where(activity_id: activity_id, classroom_unit_id: classroom_unit_ids, state: 'finished', user_id: assigned_student_ids)
      .order(completed_at: :desc)
      .uniq { |activity_session| activity_session.user_id }
    record = records[0]
    return if !record

    record['completed_count'] = activity_sessions.size
    record['assigned_count'] = assigned_student_ids.size
    record.except('unit_id', 'unit_name', 'classroom_unit_id', 'assigned_student_ids')
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def grouped_name(record)
    activity_ids_to_names = {
      Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID => 'Starter Diagnostic',
      Activity::INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID => 'Intermediate Diagnostic',
      Activity::ADVANCED_DIAGNOSTIC_ACTIVITY_ID => 'Advanced Diagnostic',
      Activity::ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID => 'ELL Starter Diagnostic',
      Activity::ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID => 'ELL Intermediate Diagnostic',
      Activity::ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID => 'ELL Advanced Diagnostic'
    }

    activity_id = record['activity_id']
    activity_ids_to_names[activity_id] || record['activity_name']
  end

end
