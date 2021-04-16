class GenerateFullname

  def initialize(name)
    @name = name
  end

  def call
    generate_fullname
  end

  attr_reader :name
  private :name

  private def generate_fullname
    first_name, last_name = SplitName.new(name).call

    if last_name.nil? && first_name.present?
      return "#{first_name} #{first_name}"
    end

    if last_name.nil? && first_name.nil?
      return 'Firstname Lastname'
    end

    name
  end
end
