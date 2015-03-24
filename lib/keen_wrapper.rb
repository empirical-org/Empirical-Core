# A class to allow disabling Keen event publishing in dev / test
class KeenWrapper
  def self.publish(event, options)
    Keen.publish(event, options) if enabled?
  rescue Keen::BadRequestError => e
    Rails.logger.error(e.to_s)
  end

  def self.enabled?
    Rails.env.production? || Rails.env.staging? || ENV['KEEN_WRITE_KEY'].present?
  end
end