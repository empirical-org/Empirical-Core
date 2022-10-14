# frozen_string_literal: true

class PackSequenceItemStatusMerger < ApplicationService
  attr_reader :pack_sequence_item_statuses, :results

  def initialize(results)
    @results = results
    @pack_sequence_item_statuses = Hash.new(PackSequenceItem::NO_LOCK)
  end

  def run
    compute_statuses
    merge_statuses
  end

  private def all_pack_sequence_item_results
    results
      .select { |result| result[PackSequence::RELEASE_METHOD_KEY] == PackSequence::STAGGERED_RELEASE }
      .reject { |result| result[PackSequence::ID_KEY].nil? }
      .group_by { |result| result[PackSequence::ID_KEY] }
      .values
  end

  private def compute_statuses
    all_pack_sequence_item_results.each do |pack_sequence_item_results|
      pack_sequence_item_statuses.merge(PackSequenceItemStatusMapper.run(pack_sequence_item_results))
    end
  end

  private def merge_statuses
    results.map do |result|
      result.merge(PackSequenceItem::STATUS_KEY => pack_sequence_item_statuses[result[PACK_SEQUENCE_ITEM_ID_KEY]])
    end
  end
end
