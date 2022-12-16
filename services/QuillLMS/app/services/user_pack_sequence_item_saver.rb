# frozen_string_literal: true

class UserPackSequenceItemSaver < ApplicationService
  attr_reader :classroom_id, :user_id, :user_pack_sequence_item_statuses

  class UserPackSequenceItemSaverError < StandardError; end

  LOCKED = UserPackSequenceItem::LOCKED
  UNLOCKED = UserPackSequenceItem::UNLOCKED
  COMPLETED_KEY = UserPackSequenceItemQuery::COMPLETED_KEY
  PACK_SEQUENCE_ID_KEY = UserPackSequenceItemQuery::PACK_SEQUENCE_ID_KEY
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
    previous_pack_sequence_id = nil
    previous_pack_sequence_item_id = nil
    previous_packs_unfinished = false
    status = UNLOCKED

    UserPackSequenceItemQuery.call(classroom_id, user_id).each do |result|
      current_pack_sequence_id = result[PACK_SEQUENCE_ID_KEY]

      unless previous_pack_sequence_id == current_pack_sequence_id
        status = UNLOCKED
        previous_packs_unfinished = false
      end

      current_pack_sequence_item_id = result[PACK_SEQUENCE_ITEM_ID_KEY]
      pack_sequence_item_changed = previous_pack_sequence_item_id != current_pack_sequence_item_id

      status = LOCKED if previous_packs_unfinished && pack_sequence_item_changed

      user_pack_sequence_item_statuses[current_pack_sequence_item_id] = status

      previous_packs_unfinished ||= !result[COMPLETED_KEY]

      previous_pack_sequence_id = current_pack_sequence_id
      previous_pack_sequence_item_id = current_pack_sequence_item_id
    end
  end

  private def save_statuses
    user_pack_sequence_item_statuses.each_pair do |pack_sequence_item_id, status|
      begin
        UserPackSequenceItem
          .find_or_create_by!(pack_sequence_item_id: pack_sequence_item_id, user_id: user_id)
          .tap { |upsi| upsi.update!(status: status) unless status == upsi.status }
      rescue ActiveRecord::RecordInvalid => e
        next if e.message == "Validation failed: Pack sequence item can't be blank"

        raise UserPackSequenceItemSaverError, e.message
      end
    end
  end
end
