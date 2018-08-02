class GenerateFullname

  def initialize(name)
    @name = name
  end

  def call
    generate_fullname
  end

  private

  attr_reader :name

  def generate_fullname
    first_name, last_name = NameSplitter.new(name).split

    if last_name.nil? && first_name.present?
      return "#{first_name} #{first_name}"
    end

    if last_name.nil? && first_name.nil?
      return 'Firstname Lastname'
    end

    name
  end
end
