# frozen_string_literal: true

module LessonsCache
  extend ActiveSupport::Concern

  def lessons_cache_info_formatter(cua)
    classroom_unit = cua.classroom_unit
    activity = cua.unit_activity.activity
    {"classroom_unit_id" => classroom_unit.id,
      "classroom_unit_activity_state_id" => cua.id,
      "activity_id" => activity.id,
      "activity_name" => activity.name,
      "unit_id" => classroom_unit.unit_id,
      "completed" => ActivitySession.has_a_completed_session?(activity.id, classroom_unit.id) || cua.completed,
      "visible" => cua.unit_activity.visible}
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def update_lessons_cache(cua)
    classroom_id = cua.classroom_unit.classroom_id
    classroom = Classroom.find_by(id: classroom_id)

    return unless classroom

    teacher = classroom.owner

    return unless cua.unit_activity.activity.lesson?

    user_ids = ClassroomsTeacher.where(classroom_id: classroom_id).map(&:user_id)
    user_ids.each do |user_id|
      lessons_cache = $redis.get("user_id:#{user_id}_lessons_array")
      if lessons_cache
        lessons_cache = JSON.parse(lessons_cache)
        formatted_lesson = lessons_cache_info_formatter(cua)
        lesson_index_in_cache = lessons_cache.find_index { |l| l['classroom_unit_activity_state_id'] == formatted_lesson['classroom_unit_activity_state_id']}
        if cua.visible == true && !lesson_index_in_cache
          lessons_cache.push(formatted_lesson)
        elsif cua.visible == false && lesson_index_in_cache
          lessons_cache.delete(formatted_lesson)
        elsif cua.completed && lesson_index_in_cache
          lessons_cache[lesson_index_in_cache] = formatted_lesson
        end
      else
        lessons_cache = format_initial_lessons_cache(teacher)
      end
      $redis.set("user_id:#{user_id}_lessons_array", lessons_cache.to_json)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def format_initial_lessons_cache(teacher)
    cuas = []
    teacher.units.each do |u|
      u.unit_activities.each do |ua|
        if ua.activity.lesson?
          cuas.push(ua.classroom_unit_activity_states)
        end
      end
    end

    cuas.flatten.map { |cua| lessons_cache_info_formatter(cua)}
  end


end
