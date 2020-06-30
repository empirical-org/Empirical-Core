module Comprehension
  class TurkingRound < ActiveRecord::Base
    belongs_to :activity, inverse_of: :turking_rounds

    validates_presence_of :activity_id
    validates :expires_at, presence: true

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: ['id', 'activity_id', 'expires_at'],
        include: [],
        methods: []
      ))
    end
  end
end
