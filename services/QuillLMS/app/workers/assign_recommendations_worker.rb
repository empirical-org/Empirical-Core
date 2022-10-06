# frozen_string_literal: true

class AssignRecommendationsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(
    classroom_id:,
    lesson:,
    student_ids:,
    unit_template_id:,
    assign_on_join: false,
    assigning_all_recommended_packs: false,
    is_last_recommendation: true
  )

    binding.pry

    classroom = Classroom.find(classroom_id)
    teacher = classroom.owner
    units = find_units(unit_template_id, teacher.id)
    unit = nil

    if units.present?
      unit = find_unit(units)
      unit.update(visible:true) if unit && !unit.visible
    end

    classroom_data = {
      id: classroom_id,
      student_ids: student_ids,
      assign_on_join: assign_on_join
    }

    assign_unit_to_one_class(unit, classroom_id, classroom_data, unit_template_id, teacher.id)
    create_or_update_activity_pack_sequence(release_method, teacher, unit_template_id)

    track_recommendation_assignment(teacher)
    return unless is_last_recommendation

    handle_error_tracking_for_diagnostic_recommendation_assignment_time(teacher.id, lesson)
    PusherRecommendationCompleted.run(classroom, unit_template_id, lesson)
    track_assign_all_recommendations(teacher) if assigning_all_recommended_packs
  end

  def assign_unit_to_one_class(unit, classroom_id, classroom_data, unit_template_id, teacher_id)
    if unit.present?
      show_classroom_units(unit.id, classroom_id)
      Units::Updater.assign_unit_template_to_one_class(unit.id, classroom_data, unit_template_id, teacher_id, concatenate_existing_student_ids: true)
    else
      Units::Creator.assign_unit_template_to_one_class(teacher_id, unit_template_id, classroom_data)
    end
  end

  def create_or_update_activity_pack_sequence(release_method, teacher, unit_template_id)
    name = UnitTemplate.find(unit_template_id).name
    unit = Unit.find_by(name: name, user: teacher, unit_template_id: unit_template_id)
    activity_pack_sequence = ActivityPackSequence.create_or_find_by(
      release_method: release_method
    )



  end

  def show_classroom_units(unit_id, classroom_id)
    ClassroomUnit.unscoped.where(unit_id: unit_id, classroom_id: classroom_id, visible: false).each do |classroom_unit|
      classroom_unit.update(visible: true, assigned_student_ids: [])
    end
  end

  def track_recommendation_assignment(teacher)
    analytics = Analyzer.new
    analytics.track(teacher, SegmentIo::BackgroundEvents::ASSIGN_RECOMMENDATIONS)
  end

  def track_assign_all_recommendations(teacher)
    analytics = Analyzer.new
    analytics.track(teacher, SegmentIo::BackgroundEvents::ASSIGN_ALL_RECOMMENDATIONS)
  end

  def find_unit(units)
    if units.length > 1
      visible_units = units.where(visible: true)
      visible_units.empty? ? units.order('updated_at DESC').first : visible_units.first
    elsif units.length == 1
      units.first
    end
  end

  def find_units(unit_template_id, teacher_id)
    # try to find by new unit_template_id first, and then old method if that fails
    units = Unit.unscoped.where(unit_template_id: unit_template_id, user_id: teacher_id)
    if units.empty?
      Unit.unscoped.where(name: UnitTemplate.find(unit_template_id).name, user_id: teacher_id)
    else
      units
    end
  end

  def handle_error_tracking_for_diagnostic_recommendation_assignment_time(teacher_id, lesson)
    lesson_text = lesson ? "lesson_" : ''
    start_time = $redis.get("user_id:#{teacher_id}_#{lesson_text}diagnostic_recommendations_start_time")
    return unless start_time

    elapsed_time = Time.current - start_time.to_time
    if elapsed_time > 10
      diagnostic_recommendations_over_ten_seconds_count = $redis.get("#{lesson_text}diagnostic_recommendations_over_ten_seconds_count")
      if diagnostic_recommendations_over_ten_seconds_count
        $redis.set("#{lesson_text}diagnostic_recommendations_over_ten_seconds_count", diagnostic_recommendations_over_ten_seconds_count.to_i + 1)
      else
        $redis.set("#{lesson_text}diagnostic_recommendations_over_ten_seconds_count", 1)
      end
      begin
        raise "#{elapsed_time} seconds for user #{teacher_id} to assign #{lesson_text} recommendations"
      rescue => e
        NewRelic::Agent.notice_error(e)
      end
    else
      diagnostic_recommendations_under_ten_seconds_count = $redis.get("diagnostic_recommendations_under_ten_seconds_count")
      if diagnostic_recommendations_under_ten_seconds_count
        $redis.set("#{lesson_text}diagnostic_recommendations_under_ten_seconds_count", diagnostic_recommendations_under_ten_seconds_count.to_i + 1)
      else
        $redis.set("#{lesson_text}diagnostic_recommendations_under_ten_seconds_count", 1)
      end
    end
    $redis.del("user_id:#{teacher_id}_#{lesson_text}diagnostic_recommendations_start_time")
  end
end
