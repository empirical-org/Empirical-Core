# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequence_units
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
#  index_activity_pack_sequence_units_on_activity_pack_sequence_id  (activity_pack_sequence_id)
#  index_activity_pack_sequence_units_on_unit_id                    (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_pack_sequence_id => activity_pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
class ActivityPackSequenceUnit < ApplicationRecord
  belongs_to :unit
  belongs_to :activity_pack_sequence
end
