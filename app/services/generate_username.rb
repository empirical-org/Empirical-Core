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
    part1         = "#{first_name}.#{last_name}"
    part1_pattern = "%#{part1}%"
    at_classcode  = at_classcode(classcode)
    extant        = User.where("username ILIKE ?", part1_pattern)

    if extant.any?
      final = "#{part1}#{extant.length + 1}#{at_classcode}"
    else
      final = "#{part1}#{at_classcode}"
    end
    final
  end

  def at_classcode(classcode)
    return "" if classcode.nil?
    "@#{classcode}"
  end
end
