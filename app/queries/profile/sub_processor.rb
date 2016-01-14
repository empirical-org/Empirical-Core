class Profile::SubProcessor

  # need to serialize

  def query(student, batch_size, offset)
    all = Profile::Query.new.query(student, batch_size, offset)
    is_last_page = (all.count < batch_size)
    by_unit = group_by_unit(all)
    by_unit_by_state = group_by_state_within_unit(by_unit)
    sorted = sort_sessions(by_unit_by_state)
    return [sorted, is_last_page]
  end

  private


  def group_by_unit(all)
    all.select{|s| s.classroom_activity.unit.present?}
       .group_by{|s| s.classroom_activity.unit.name}
  end

  def group_by_state_within_unit(by_unit)
    result = by_unit.reduce({}) do |acc, (k, v)|
      acc[k] = group_by_presentation_state(v)
      acc
    end
    result
  end

  def group_by_presentation_state(r)
    r.group_by do |s|
       if s.state == 'finished'
        result = :finished
       else
        result = :not_finished
       end
       result
    end
  end

  def sort_sessions(hash)
    result = hash.reduce({}) do |acc, (k,v)|
      acc[k] = sort_within_unit(v)
      acc
    end
  end

  def sort_within_unit(hash)
    hash.reduce({}) do |acc, (k,v)|
      acc[k] = send("sort_#{k}", v)
      acc
    end
  end

  def sort_finished(activity_sessions)
    activity_sessions.sort_by{ |as| [(-1*as.percentage), as.activity.activity_classification_id] }
  end

  def sort_not_finished(activity_sessions)
    dued, not_dued = activity_sessions.partition{|as| as.classroom_activity.due_date.present? }
    sort_dued(dued).concat(sort_not_dued(not_dued))
  end

  def sort_dued(activity_sessions)
    activity_sessions.sort_by{ |as| [as.classroom_activity.due_date, as.activity.activity_classification_id] }
  end

  def sort_not_dued(activity_sessions)
    activity_sessions.sort_by{ |as| as.created_at }
  end
end
