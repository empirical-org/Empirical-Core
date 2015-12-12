class UsernameGenerator
  attr_accessor :user

  def initialize(user)
    @user = user
  end

  def student
    part1 = "#{first_name}.#{last_name}"
    part1_pattern = "%#{part1}%"
    extant = User.where('username ILIKE ?', part1_pattern)
    if extant.any?
      final = "#{part1}#{extant.length + 1}@#{classcode}"
    else
      final = "#{part1}@#{classcode}"
    end
    final
  end

  private

  # to foreground this class's expectations about the user data structure :
  def first_name
    user.first_name
  end

  def last_name
    user.last_name
  end

  def classcode
    user.classcode
  end
end
