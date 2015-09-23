class FullnameValidator < ActiveModel::Validator

  def validate(record)
    return if record.name.nil?
    f,l = NameSplitter.new(record.name).split
    if f.nil? or l.nil?
      record.errors[:name] << "must include first and last name"
    end
  end
end
