class CreateOrIncrementResponseWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(new_vals)
    symbolized_vals = new_vals.symbolize_keys
    response = Response.find_by(text: symbolized_vals[:text], question_uid: symbolized_vals[:question_uid])
    if !response
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
        NewRelic::Agent.notice_error(e)
      end
    else
      increment_counts(response, symbolized_vals)
    end
  end

  def increment_counts(response, symbolized_vals)
    response.increment!(:count)
    increment_first_attempt_count(response, symbolized_vals)
    increment_child_count_of_parent(response)
  end

  def increment_first_attempt_count(response, symbolized_vals)
    symbolized_vals[:is_first_attempt] == "true" ? response.increment!(:first_attempt_count) : nil
  end

  def increment_child_count_of_parent(response)
    parent_id = response.parent_id
    parent_uid = response.parent_uid
    id = parent_id || parent_uid
    # id will be the first extant value or false. somehow 0 is being
    # used as when it shouldn't (possible JS remnant) so we verify that
    # id is truthy and not 0
    if id && id != 0
      parent = Response.find_by_id_or_uid(id)
      parent.increment!(:child_count) unless parent.nil?
    end
  end

end
