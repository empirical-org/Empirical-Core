class CreateOrIncrementResponseWorker
  include Sidekiq::Worker

  def perform(new_vals)
    indifferent_vals = new_vals.with_indifferent_access
    response = Response.find_by(text: indifferent_vals[:text], question_uid: indifferent_vals[:question_uid])
    if !response
      response = Response.new(indifferent_vals)
      if !response.text.blank? && response.save!
        AdminUpdates.run(response.question_uid)
      end
    else
      increment_counts(response, indifferent_vals)
    end
  end

  def increment_counts(response, indifferent_vals)
    response.increment!(:count)
    increment_first_attempt_count(response, indifferent_vals)
    increment_child_count_of_parent(response)
    response.update_index_in_elastic_search
  end

  def increment_first_attempt_count(response, indifferent_vals)
    indifferent_vals[:is_first_attempt] == "true" ? response.increment!(:first_attempt_count) : nil
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
