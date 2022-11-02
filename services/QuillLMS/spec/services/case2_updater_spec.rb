# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Case2Updater do
  subject { described_class.run(activity_session) }

  let!(:pack_sequence) { create(:pack_sequence) }
  let!(:pack_sequence_item1) { create(:pack_sequence_item, pack_sequence: pack_sequence) }
  let!(:pack_sequence_item2) { create(:pack_sequence_item, pack_sequence: pack_sequence) }

  let!(:classroom) { pack_sequence.classroom }
  let!(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom) }
  let!(:unit_activity1) { create(:unit_activity, unit: unit) }
  let!(:unit_activity2) { create(:unit_activity, unit: unit) }
  let!(:unit_activity3) { create(:unit_activity, unit: unit) }

  let(:activity_session) do
    create(:activity_session,
      activity_session_state_trait,
      activity: activity,
      classroom_unit: classroom_unit
    )
  end

  let(:user) { activity_session.user }

  let(:locked) { PackSequenceItem::LOCKED }
  let(:unlocked) { PackSequenceItem::UNLOCKED }

  context ActivitySession::STATE_FINISHED do
    let(:activity_session_state_trait) { ActivitySession::STATE_FINISHED.to_sym }

    context 'activity session occurs in first unit' do
      let(:unit) { pack_sequence_item1.unit}
      let(:activity) { unit_activity1.activity }

      let!(:user_pack_sequence_item) do
        create(:user_pack_sequence_item, :unlocked, user: user, pack_sequence_item: pack_sequence_item1)
      end

      it do
        subject
      end

      #   context 'user is not assigned to second pack' do
      #   end
    end

    # context 'activity session occurs in second unit' do
    #   let(:unit) { pack_sequence_item2.unit }
    # end

  end

  # context ActivitySession::STATE_STARTED do
  #   let(:trait) { ActivitySession::STATE_STARTED.to_sym }
  # end

  # context ActivitySession::STATE_UNSTARTED do
  #   let(:trait) { ActivitySession::STATE_UNSTARTED.to_sym }
  # end
end

# PackSequence
#   .joins(:pack_sequence_items)
#   .joins(:user_pack_sequence_items)
#   .joins(:units)
#   .joins(:classroom_units)
#   .joins(:unit_activities)
#   .joins(:activities)
#   .left_outer_join(:activity_sesssions)
#   .where(classroom_units: { visible: true, classroom_id: classroom_id } )
#   .where(units: { visible: true } )
#   .where(unit_activities: { visible: true } )

# .where('id = ANY(ARRAY[?]::int[])', ids.map { |i| i})

# pack_sequence (classroom1)
#   pack_sequence_item1 (unit1)
#     activity1_1
#       -> activity_session 1_1
#     activity1_2
#       -> activity_session 1_2
#     activity1_3
#       -> activity_session 1_3

#   pack_sequence_item2 (unit2)
#     activity2_1
#       -> activity_session 2_1
#     activity2_2
#       -> activity_session 2_2
#     activity2_3
#       -> activity_session 2_3

#   pack_sequence_item3 (unit3)
#     activity3_1
#       -> activity_session 3_1
#     activity2_2
#       -> activity_session 3_2
#     activity2_3
#       -> activity_session 3_3


