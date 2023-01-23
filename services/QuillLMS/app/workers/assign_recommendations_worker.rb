# frozen_string_literal: true

class AssignRecommendationsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(options={})
    assign_on_join = options['assign_on_join'] || false
    assigning_all_recommended_packs = options['assigning_all_recommended_packs'] || false
    classroom_id = options['classroom_id']
    is_last_recommendation = options['is_last_recommendation']
    lesson = options['lesson']
    order = options['order']
    pack_sequence_id = options['pack_sequence_id']
    student_ids = options['student_ids']
    unit_template_id = options['unit_template_id']

    assign_unit_to_one_class(classroom_id, unit_template_id, student_ids, assign_on_join)

    unit = Unit::AssignmentHelpers.find_unit_from_units(Unit::AssignmentHelpers.find_units_from_unit_template_and_teacher(unit_template_id, teacher.id)) if unit.nil?
    classroom_unit = ClassroomUnit.find_by(unit: unit, classroom_id: classroom_id)

    save_pack_sequence_item(classroom_unit, pack_sequence_id, order)

    release_method = pack_sequence_id.nil? ? :Immediate : :Staggered
    track_recommendation_assignment(teacher, release_method)
    return unless is_last_recommendation

    handle_error_tracking_for_diagnostic_recommendation_assignment_time(teacher.id, lesson)
    PusherRecommendationCompleted.run(classroom, unit_template_id, lesson)
    track_assign_all_recommendations(teacher) if assigning_all_recommended_packs
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def save_pack_sequence_item(classroom_unit, pack_sequence_id, order)
    return unless PackSequence.exists?(id: pack_sequence_id)
    return if pack_sequence_id.nil? || classroom_unit.nil?

    PackSequenceItem.find_or_create_by!(
      classroom_unit: classroom_unit,
      pack_sequence_id: pack_sequence_id,
      order: order
    )
  end

  def track_recommendation_assignment(teacher, release_method)
    Analyzer.new.track_with_attributes(
      teacher,
      SegmentIo::BackgroundEvents::ASSIGN_RECOMMENDATIONS,
      properties: { release_method: release_method }
    )
  end

  def track_assign_all_recommendations(teacher)
    analytics = Analyzer.new
    analytics.track(teacher, SegmentIo::BackgroundEvents::ASSIGN_ALL_RECOMMENDATIONS)
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
