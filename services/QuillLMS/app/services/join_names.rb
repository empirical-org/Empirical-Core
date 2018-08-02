module JoinNames

  def initialize(first_name, last_name)
    @first_name = first_name
    @last_name  = last_name
  end

  def call
    first_name = first_name.blank? ? 'Firstname' : first_name.capitalize
    last_name  = last_name.blank?  ? 'Lastname'  : last_name.capitalize

    "#{first_name} #{last_name}"
  end

  private

  attr_reader :first_name, :last_name
end
