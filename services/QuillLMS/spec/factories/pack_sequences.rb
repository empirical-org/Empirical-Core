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
FactoryBot.define do
  factory :pack_sequence do
    classroom
    association :diagnostic_activity, factory: :diagnostic_activity
    release_method PackSequence::STAGGERED_RELEASE
  end
end
