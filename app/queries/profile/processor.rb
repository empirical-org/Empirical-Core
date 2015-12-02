class Profile::Processor

  # need to serialize

  def query(student)
    sorted = Profile::SubProcessor.new.query(student)
    serialized = serialize(sorted)
    return serialized
  end

  private

  def serialize(groups_of_groups)
    groups_of_groups.reduce({}) do |acc, (k, group)|
      acc[k] = group.reduce({}) do |acc2, (k2, v)|
        acc2[k2] = v.map{|v1| Profile::ActivitySessionSerializer.new(v1, root: false)}
        acc2
      end
      acc
    end
  end
end