class Profile::Processor
  BATCH_SIZE = 10
  # need to serialize

  def query(student, current_page, classroom_id)
    sorted, is_last_page = Profile::SubProcessor.new.query(student, BATCH_SIZE, offset(current_page), classroom_id)
    serialized = serialize(sorted)
    return [serialized, is_last_page]
  end

  private

  def offset(current_page)
    (current_page - 1)*BATCH_SIZE # current_page will be 0 on first fetch
  end

  def serialize(groups_of_groups)
    groups_of_groups.reduce({}) do |acc, (k, group)|
      acc[k] = group.reduce({}) do |acc2, (k2, v)|
        acc2[k2] = v.map{|v1| Profile::StudentActivitySessionSerializer.new(v1, root: false)}
        acc2
      end
      acc
    end
  end
end
