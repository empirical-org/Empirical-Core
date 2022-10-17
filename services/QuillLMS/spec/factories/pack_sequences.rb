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
FactoryBot.define do
  factory :pack_sequence do
    classroom
    association :diagnostic_activity, factory: :diagnostic_activity
    release_method PackSequence::STAGGERED_RELEASE
  end
end
