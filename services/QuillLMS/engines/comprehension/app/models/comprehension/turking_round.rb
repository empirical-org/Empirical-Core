module Comprehension
  class TurkingRound < ActiveRecord::Base
    belongs_to :activity, inverse_of: :turking_rounds

    validates_presence_of :activity_id
    validates :expires_at, presence: true
    validate :expires_at_in_future, on: :create

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: ['id', 'activity_id', 'expires_at']
      ))
    end

    def expire!
      update_attributes(expires_at: Time.zone.now)
    end

    private def expires_at_in_future
      return if expires_at.blank?
      errors.add(:expires_at, 'must be in the future') unless expires_at > Time.zone.now
    end
  end
end
