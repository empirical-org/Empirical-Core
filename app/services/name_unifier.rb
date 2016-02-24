module NameUnifier

  def self.run(first_name, last_name)
    good_first_name = self.good_name_part(first_name, "firstname")
    good_last_name = self.good_name_part(last_name, "lastname")
    "#{good_first_name.capitalize} #{good_last_name.capitalize}"
  end

  private

  def self.good_name_part(name_part, fallback)
    if self.invalid(name_part)
      result = fallback
    else
      result = name_part
    end
    result
  end

  def self.invalid(name_part)
    name_part.nil? || name_part == ''
  end
end