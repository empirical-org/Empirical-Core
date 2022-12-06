# frozen_string_literal: true

# This worker clears the content of the TeacherActivityFeed
# and refills it will the teacher's most recent 40 activity sessions
class TeacherActivityFeedRefillWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(user_id)
    teacher = User.teacher.find_by(id: user_id)

    return unless teacher

    ids = ids_for_activity_feed(teacher)

    TeacherActivityFeed.reset!(user_id)

    return if ids.empty?

    TeacherActivityFeed.add(user_id, ids)
  end

  def ids_for_activity_feed(teacher)
    classroom_ids = teacher.classrooms_i_teach.map(&:id)
    classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)

    return [] if classroom_unit_ids.empty?

    # performing the sort in ruby to avoid order/limit on large table
    # Original order/limit query was taking an hour for some teachers
    ActivitySession
      .unscoped
      .completed
      .visible
      .where(classroom_unit_id: classroom_unit_ids)
      .pluck(:id, :completed_at)
      .sort_by(&:last) # sort by completed_at
      .reverse # make sort DESC
      .map(&:first)
      .first(TeacherActivityFeed::LIMIT)
  end
end
