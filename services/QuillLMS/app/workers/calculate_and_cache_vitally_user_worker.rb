# frozen_string_literal: true

class CalculateAndCacheVitallyUserWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(user_id, year)
    teacher = User.find(user_id)
    data = VitallyIntegration::PreviousYearTeacherDatum.new(teacher, year).calculate_data
    VitallyIntegration::CacheVitallyTeacherData.set(user_id, year, data.to_json)
  end
end
