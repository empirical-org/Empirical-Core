# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint
#  diagnostic_activity_id :bigint
#
# Indexes
#
#  index_pack_sequences_on_classroom_id            (classroom_id)
#  index_pack_sequences_on_diagnostic_activity_id  (diagnostic_activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (diagnostic_activity_id => activities.id)
#
class PackSequence < ApplicationRecord
  RELEASE_METHODS = [
    STAGGERED_RELEASE = 'staggered'
  ]

  ID_KEY = 'pack_sequence_id'
  RELEASE_METHOD_KEY = 'pack_sequence_release_method'

  belongs_to :classroom
  belongs_to :diagnostic_activity, class_name: 'Activity'

  has_many :pack_sequence_items, dependent: :destroy
  has_many :user_pack_sequence_items, through: :pack_sequence_items

  validates :release_method, inclusion: { in: RELEASE_METHODS }
end
