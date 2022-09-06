# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequence_activity_packs
#
#  id                        :bigint           not null, primary key
#  order                     :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  activity_pack_sequence_id :bigint
#  unit_id                   :bigint
#
# Indexes
#
#  index_activity_pack_sequence_activity_packs_on_act_pack_seq_id  (activity_pack_sequence_id)
#  index_activity_pack_sequence_activity_packs_on_unit_id          (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_pack_sequence_id => activity_pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
class ActivityPackSequenceActivityPack < ApplicationRecord
  belongs_to :activity_pack_sequence
  belongs_to :activity_pack
end
