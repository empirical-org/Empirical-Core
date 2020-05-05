class ConceptFeedback < ActiveRecord::Base
  TYPES = [
    TYPE_CONNECT = 'connect',
    TYPE_GRAMMAR = 'grammar'
  ]
  validates :data, presence: true
  validates :uid, presence: true, uniqueness: true
  validates :activity_type, presence: true, inclusion: {in: TYPES}
  validate :data_must_be_hash

  def as_json(options=nil)
    data
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end

