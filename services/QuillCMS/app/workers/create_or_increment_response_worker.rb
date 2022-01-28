class CreateOrIncrementResponseWorker
  include Sidekiq::Worker
  sidekiq_options retry: 3, queue: SidekiqQueue::CRITICAL

  class RaceConditionError < StandardError; end

  def perform(new_vals)
    symbolized_vals = new_vals.symbolize_keys
    response = Response.find_by(text: symbolized_vals[:text], question_uid: symbolized_vals[:question_uid])
    if response
      increment_counts(response, symbolized_vals)
    else
      begin
        response = Response.new(symbolized_vals)
        if !response.text.blank? && response.save!
          AdminUpdates.run(response.question_uid)
        end
      # In cases with "bad faith" responses that are particularly large,
      # Elasticsearch will reject them.  But we don't want to retry indexing
      # those, so we rescue the exception and do make sure AdminUpdates run.
      # The data should persist to the DB safely.
      rescue Elasticsearch::Transport::Transport::Errors::BadRequest => e
        AdminUpdates.run(response.question_uid)
      rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid => e
        raise CreateOrIncrementResponseWorker::RaceConditionError, symbolized_vals[:question_uid]
      end
    end
  end

  def increment_counts(response, symbolized_vals)
    response.increment!(:count, 1, touch: true)
    increment_first_attempt_count(response, symbolized_vals)
    increment_child_count_of_parent(response)
  end

  def increment_first_attempt_count(response, symbolized_vals)
    symbolized_vals[:is_first_attempt] == "true" ? response.increment!(:first_attempt_count, 1, touch: true) : nil
  end

  def increment_child_count_of_parent(response)
    parent_id = response.parent_id
    parent_uid = response.parent_uid
    id = parent_id || parent_uid
    # id will be the first extant value or false. somehow 0 is being
    # used as when it shouldn't (possible JS remnant) so we verify that
    # id is truthy and not 0
    return unless id
    return if id == 0

    parent = Response.find_by_id_or_uid(id)
    parent.increment!(:child_count, 1, touch: true) unless parent.nil?
  end

end
