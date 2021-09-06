class SyncVitallyPastYearUsersWorker
  include Sidekiq::Worker

  def perform(teacher_ids, year)
    teachers = User.where(id: teacher_ids)
    teachers.each do |teacher|
      PreviousYearTeacherDatum.new(teacher, year).calculate_and_save_data
    end
  end
end
