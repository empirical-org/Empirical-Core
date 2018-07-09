module LessonsConcern
  extend ActiveSupport::Concern


 # wip
  def lessons_cache_info_formatter
    {"classroom_activity_id" => self.id, "activity_id" => activity.id, "activity_name" => activity.name, "unit_id" => self.unit_id, "completed" => self.has_a_completed_session? || self.completed}
  end

  # less concern
  def format_initial_lessons_cache
    # grab all classroom activities from the current ones's teacher, filter the lessons, then parse them
    self.classroom.owner.classroom_activities.select{|ca| ca.activity.activity_classification_id == 6}.map{|ca| ca.lessons_cache_info_formatter}
  end

  # less concern
  def update_lessons_cache
    if ActivityClassification.find_by_id(activity&.activity_classification_id)&.key == 'lessons'
      user_ids = ClassroomsTeacher.where(classroom_id: self.classroom_id).map(&:user_id)
      user_ids.each do |user_id|
        lessons_cache = $redis.get("user_id:#{user_id}_lessons_array")
        if lessons_cache
          lessons_cache = JSON.parse(lessons_cache)
          formatted_lesson = lessons_cache_info_formatter
          lesson_index_in_cache = lessons_cache.find_index { |l| l['classroom_activity_id'] == formatted_lesson['classroom_activity_id']}
          if self.visible == true && !lesson_index_in_cache
            lessons_cache.push(formatted_lesson)
          elsif self.visible == false && lesson_index_in_cache
            lessons_cache.delete(formatted_lesson)
          elsif self.completed && lesson_index_in_cache
            lessons_cache[lesson_index_in_cache] = formatted_lesson
          end
        else
          lessons_cache = format_initial_lessons_cache
        end
        $redis.set("user_id:#{user_id}_lessons_array", lessons_cache.to_json)
      end
    end
  end

end
