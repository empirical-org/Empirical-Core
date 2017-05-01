module UsernameGenerator

  def self.run(first_name, last_name, classcode)
    first_last = "#{first_name}.#{last_name}"
    at_classcode = self.at_classcode(classcode)
    tentative_username = "#{first_last}#{at_classcode}"
    while User.where("username ILIKE ?", tentative_username).first
      # while there is a user with an existing name, get the number from the
      # username and increment by one, or just add 1 to the username
      num_in_username = tentative_username.gsub(/[^\d]/, '')
      number_to_add =  num_in_username ? num_in_username.to_i + 1 : 1
      tentative_username = "#{first_last}#{number_to_add}#{at_classcode}"
    end
    tentative_username
  end

  private

  def self.at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
