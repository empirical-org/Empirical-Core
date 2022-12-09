# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string           default("staggered")
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint           not null
#  diagnostic_activity_id :bigint           not null
#
# Indexes
#
#  index_pack_sequences_on_classroom_id                             (classroom_id)
#  index_pack_sequences_on_classroom_id_and_diagnostic_activity_id  (classroom_id,diagnostic_activity_id) UNIQUE
#  index_pack_sequences_on_diagnostic_activity_id                   (diagnostic_activity_id)
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

  belongs_to :classroom
  belongs_to :diagnostic_activity, class_name: 'Activity'

  has_many :students, through: :classroom

  has_many :pack_sequence_items, dependent: :destroy
  has_many :user_pack_sequence_items, through: :pack_sequence_items
  has_many :users, through: :user_pack_sequence_items

  scope :staggered, -> { where(release_method: STAGGERED_RELEASE) }

  validates :release_method, inclusion: { in: RELEASE_METHODS }

  def save_user_pack_sequence_items
    students.pluck(:id).each { |user_id| SaveUserPackSequenceItemsWorker.perform_async(classroom&.id, user_id) }
  end
end
