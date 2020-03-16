class GenerateUsername

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

  def generate
    part1         = "#{first_name}.#{last_name}".downcase
    part1_pattern = "%#{part1}%"
    at_classcode  = at_classcode(classcode)
    extant_count  = User.where("username LIKE ?", part1_pattern).count(:id)

    if extant_count != 0
      return "#{part1}#{extant_count + 1}#{at_classcode}"
    end

    return "#{part1}#{at_classcode}"
  end

  def at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
