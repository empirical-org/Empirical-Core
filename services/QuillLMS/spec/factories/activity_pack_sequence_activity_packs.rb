# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequence_activity_packs
#
#  id                        :bigint           not null, primary key
#  order                     :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  activity_pack_id          :bigint
#  activity_pack_sequence_id :bigint
#
# Indexes
#
#  index_activity_pack_sequence_activity_packs_on_act_pack_seq_id   (activity_pack_sequence_id)
#  index_activity_pack_sequence_activity_packs_on_activity_pack_id  (activity_pack_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_pack_id => units.id)
#  fk_rails_...  (activity_pack_sequence_id => pack_sequences.id)
#
FactoryBot.define do
  factory :activity_pack_sequence_activity_pack do
    activity_pack_sequence
    association :activity_pack, factory: :unit
  end
end
