# == Schema Information
#
# Table name: concept_feedbacks
#
#  id            :integer          not null, primary key
#  activity_type :string           not null
#  data          :jsonb
#  uid           :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_concept_feedbacks_on_activity_type          (activity_type)
#  index_concept_feedbacks_on_uid_and_activity_type  (uid,activity_type) UNIQUE
#
class ConceptFeedback < ActiveRecord::Base
  TYPES = [
    TYPE_CONNECT = 'connect',
    TYPE_GRAMMAR = 'grammar'
  ]
  validates :data, presence: true
  validates :uid, presence: true, uniqueness: { scope: :activity_type }
  validates :activity_type, presence: true, inclusion: {in: TYPES}
  validate :data_must_be_hash

  def as_json(options=nil)
    data
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash)
  end
end

