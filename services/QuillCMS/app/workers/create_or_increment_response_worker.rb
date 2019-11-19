class CreateOrIncrementResponseWorker
  include Sidekiq::Worker

  def perform(new_vals)
    symbolized_vals = new_vals.symbolize_keys
    response = Response.find_by(text: symbolized_vals[:text], question_uid: symbolized_vals[:question_uid])
    if !response
      response = Response.new(symbolized_vals)
      if !response.text.blank? && response.save!
        AdminUpdates.run(response.question_uid)
      end
    else
      increment_counts(response, symbolized_vals)
    end
  end

  def increment_counts(response, symbolized_vals)
    response.increment!(:count)
    increment_first_attempt_count(response, symbolized_vals)
    increment_child_count_of_parent(response)
    response.update_index_in_elastic_search
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
