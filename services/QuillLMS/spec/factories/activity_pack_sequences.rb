# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string           default("immediate")
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint
#  diagnostic_activity_id :bigint
#
# Indexes
#
#  index_activity_pack_sequences_on_classroom_id            (classroom_id)
#  index_activity_pack_sequences_on_diagnostic_activity_id  (diagnostic_activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (diagnostic_activity_id => activities.id)
#
FactoryBot.define do
  factory :activity_pack_sequence do
    classroom
    association :source, factory: :diagnostic_activity

    trait(:staggered) { release_method ActivityPackSequence::STAGGERED_RELEASE }
    trait(:immediate) { release_method ActivityPackSequence::IMMEDIATE_RELEASE}
  end
end
