class SyncVitallyPastYearAccountsWorker
  include Sidekiq::Worker

  def perform(school_ids, year)
    schools = School.where(id: school_ids)
    schools.each do |school|
      PreviousYearSchoolDatum.new(school, year).calculate_and_save_data
    end
  end
end
