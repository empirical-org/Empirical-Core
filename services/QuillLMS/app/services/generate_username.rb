class GenerateUsername
  MAX_LOOPS = 1_000

  def initialize(first_name, last_name, classcode)
    @first_name = first_name
    @last_name = last_name
    @classcode = classcode
  end

  def call
    generate
  end

  private

  attr_reader :first_name, :last_name, :classcode


  # NB, This will produce and invalid username if there are
  # more than 1,000 (MAX_LOOPS) students in a class
  # with the same first and last names. Putting in place to prevent a never-ending loop
  def generate
    name_string = "#{first_name}.#{last_name}".downcase
    at_classcode = at_classcode(classcode)

    username = "#{name_string}#{at_classcode}"
    count = 1

    while User.where(username: username).exists? && count < MAX_LOOPS
      username = "#{name_string}#{count}#{at_classcode}"
      count += 1
    end

    username
  end

  def at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
