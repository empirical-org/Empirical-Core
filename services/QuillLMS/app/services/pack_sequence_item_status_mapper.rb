# frozen_string_literal: true

class PackSequenceItemStatusMapper < ApplicationService
  attr_reader :pack_sequence_item_results, :pack_sequence_item_statuses

  LOCKED = PackSequenceItem::LOCKED
  UNLOCKED = PackSequenceItem::UNLOCKED

  def initialize(pack_sequence_item_results)
    @pack_sequence_item_results = pack_sequence_item_results
    @pack_sequence_item_statuses = {}
  end


  def run
    map_statuses
    pack_sequence_item_statuses
  end

  private def map_statuses
    previous_packs_unfinished = false
    previous_id = nil
    status = UNLOCKED

    ordered_pack_sequence_item_results.each do |pack_sequence_item_result|
      current_id = pack_sequence_item_result[PackSequenceItem::ID_KEY]
      pack_sequence_item_changed = previous_id != current_id

      status = LOCKED if status == UNLOCKED && previous_packs_unfinished && pack_sequence_item_changed
      pack_sequence_item_statuses[current_id] = status

      previous_packs_unfinished ||= !pack_sequence_item_result[ActivitySession::STATE_FINISHED_KEY]
      previous_id = current_id
    end
  end

  private def ordered_pack_sequence_item_results
    pack_sequence_item_results.sort_by { |result| result[PackSequenceItem::ORDER_KEY] }
  end
end
