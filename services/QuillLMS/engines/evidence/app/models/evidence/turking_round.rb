# frozen_string_literal: true

module Evidence
  class TurkingRound < ApplicationRecord
    self.table_name = 'comprehension_turking_rounds'

    attr_readonly :uuid

    before_validation :set_default_uuid, on: :create

    belongs_to :activity, inverse_of: :turking_rounds

    validates_presence_of :activity_id
    validates_presence_of :uuid, on: :update
    validates :uuid, uniqueness: { case_sensitive: false }
    validates :expires_at, presence: true
    validate :expires_at_in_future, on: :create

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: ['id', 'uuid', 'activity_id', 'expires_at']
      ))
    end

    def expire!
      update_attributes(expires_at: Time.current)
    end

    private def expires_at_in_future
      return if expires_at.blank?

      errors.add(:expires_at, 'must be in the future') unless expires_at > Time.current
    end

    private def set_default_uuid
      self.uuid ||= SecureRandom.uuid
    end
  end
end
