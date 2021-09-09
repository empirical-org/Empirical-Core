module Evidence
  class TurkingRoundActivitySession < ApplicationRecord
    self.table_name = 'comprehension_turking_round_activity_sessions'

    belongs_to :turking_round

    validates :activity_session_uid, presence: true, uniqueness: true
    validates :turking_round_id, presence: true

    # FIXME, fill in attributes for json
    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :turking_round_id, :activity_session_uid]
      ))
    end
  end
end
