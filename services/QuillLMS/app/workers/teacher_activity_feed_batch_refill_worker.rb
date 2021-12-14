# frozen_string_literal: true

class TeacherActivityFeedBatchRefillWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW
  DELAY = 3.seconds

  def perform(start_date, end_date, delay = DELAY)
    teachers = User
      .teacher
      .where(last_sign_in: start_date...end_date)
      .select(:id)

    teachers.find_each.with_index do |teacher, index|
      TeacherActivityFeedRefillWorker.perform_in(index * delay, teacher.id)
    end
  end
end
