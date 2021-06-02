# This worker clears the content of the TeacherActivityFeed
# and refills it will the teacher's most recent 40 activity sessions
class TeacherActivityFeedRefillWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  def perform(user_id)
    teacher = Teacher.find(user_id)

    return unless teacher

    ids = ids_for_activity_feed(teacher)

    return if ids.empty?

    TeacherActivityFeed.reset!(user_id)
    # Note, reversing id order since .add
    # pops each from the front of the array
    TeacherActivityFeed.add(user_id, ids.reverse)
  end

  def ids_for_activity_feed(teacher)
    classroom_ids = teacher.classrooms_i_teach.map(&:id)
    classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)

    return [] if classroom_unit_ids.empty?

    ActivitySession.unscoped
      .completed
      .visible
      .where(classroom_unit_id: classroom_unit_ids)
      .order("completed_at DESC")
      .limit(TeacherActivityFeed::LIMIT)
      .pluck(:id)
  end
end
