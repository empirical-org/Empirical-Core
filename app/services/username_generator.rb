module UsernameGenerator

  def self.run(first_name, last_name, classcode)
    part1 = "#{first_name}.#{last_name}"
    at_classcode = self.at_classcode(classcode)
    pattern = "#{part1}[0-9]+#{at_classcode}"
    extant = User.where("username SIMILAR TO ?", pattern)

    if extant.any?
      final = "#{part1}#{extant.length + 1}#{at_classcode}"
    else
      pattern2 = "#{part1}#{at_classcode}"
      if User.where("username = ?", pattern2).any?
        final = "#{part1}2#{at_classcode}"
      else
        final = pattern2
      end
    end
    final
  end

  private

  def self.at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
