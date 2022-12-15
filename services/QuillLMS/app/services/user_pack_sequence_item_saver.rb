# frozen_string_literal: true

class UserPackSequenceItemSaver < ApplicationService
  attr_reader :classroom_id, :user_id, :user_pack_sequence_item_statuses

  LOCKED = UserPackSequenceItem::LOCKED
  UNLOCKED = UserPackSequenceItem::UNLOCKED
  COMPLETED_KEY = UserPackSequenceItemQuery::COMPLETED_KEY
  PACK_SEQUENCE_ITEM_ID_KEY = UserPackSequenceItemQuery::PACK_SEQUENCE_ITEM_ID_KEY

  def initialize(classroom_id, user_id)
    @classroom_id = classroom_id
    @user_id = user_id
    @user_pack_sequence_item_statuses = {}
  end

  def run
    ActiveRecord::Base.transaction do
      compute_statuses
      save_statuses
    end
  end

  private def compute_statuses
    previous_packs_unfinished = false
    previous_pack_sequence_id = nil
    status = UNLOCKED

    user_pack_sequence_item_results.each do |user_pack_sequence_item_result|
      current_pack_sequence_id = user_pack_sequence_item_result[PACK_SEQUENCE_ITEM_ID_KEY]
      pack_sequence_item_changed = previous_pack_sequence_id != current_pack_sequence_id

      status = LOCKED if previous_packs_unfinished && pack_sequence_item_changed
      user_pack_sequence_item_statuses[current_pack_sequence_id] = status

      previous_packs_unfinished ||= !user_pack_sequence_item_result[COMPLETED_KEY]
      previous_pack_sequence_id = current_pack_sequence_id
    end
  end

  private def save_statuses
    user_pack_sequence_item_statuses.each_pair do |pack_sequence_item_id, status|
      PackSequenceItem
        .find_by(id: pack_sequence_item_id)
        &.user_pack_sequence_items
        &.find_or_create_by!(user_id: user_id)
        &.tap { |upsi| upsi.update!(status: status) unless status == upsi.status }
    end
  end

  private def user_pack_sequence_item_results
    @user_pack_sequence_item_results ||= UserPackSequenceItemQuery.call(classroom_id, user_id)
  end
end
