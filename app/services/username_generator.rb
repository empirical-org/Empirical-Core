module UsernameGenerator

  def self.run(first_name, last_name, classcode)
    part1 = "#{first_name}.#{last_name}"
    part1_pattern = "%#{part1}%"
    at_classcode = self.at_classcode(classcode)
    extant = User.where("username ILIKE ?", part1_pattern)

    if extant.any?
      final = "#{part1}#{extant.length + 1}#{at_classcode}"
    else
      final = "#{part1}#{at_classcode}"
    end
    final
  end

  private

  def self.at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
