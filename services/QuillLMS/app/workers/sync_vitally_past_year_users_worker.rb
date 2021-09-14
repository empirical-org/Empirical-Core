class SyncVitallyPastYearUsersWorker
  include Sidekiq::Worker

  def perform(teacher_ids, year)
    teachers = User.where(id: teacher_ids)
    teachers.each do |teacher|
      CalculateAndCacheVitallyUserWorker.perform_async(teacher.id, year)
    end
  end
end
