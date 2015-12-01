class Profile::Processor

  # need to serialize

  def query(student)
    all = Profile::Query.new.query(student).select{|s| s.unit.present?}
    by_unit = group_by_unit(all)
    by_unit_by_state = group_by_state_within_unit(by_unit)
    sorted = sort_sessions(by_unit_by_state)
    return sorted
  end

  private

  def group_by_unit(all)
    all.group_by{|s| s.classroom_activity.unit.name}
  end

  def group_by_state_within_unit(by_unit)
    result = by_unit.reduce({}) do |acc, (k, v)|
      acc[k] = group_by_state(v)
      acc
    end
    result
  end

  def group_by_state r
    r.group_by{|s| s.state}
  end

  def sort_sessions hash
    result = hash.reduce({}) do |acc, (k,v)|
      acc[k] = sort_sessions_helper(v)
      acc
    end
  end

  def sort_sessions_helper hash
    result = {
      "finished" => sort_finished(hash["finished"] || []) }
    arr = hash["started"] || []
    arr += (hash["unstarted"]) if hash["unstarted"]
    result["unstarted"] = sort_rest(arr) || []
    result
  end

  def sort_rest activity_sessions
    activity_sessions.sort_by{|as| [date_helper(as.classroom_activity.due_date), as.activity.activity_classification_id]}
  end


  def sort_finished activity_sessions
    activity_sessions.sort_by{|as| [(-1*as.percentage), as.activity.activity_classification_id]}
  end

  def date_helper(date)
    unless date
      date = Time.zone.now
    end
    return date
  end

end
