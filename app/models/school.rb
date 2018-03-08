class School < ActiveRecord::Base
  has_one :school_subscription
  has_one :subscription, through: :school_subscription
  has_many :schools_users,  class_name: 'SchoolsUsers'
  has_many :users, through: :schools_users
  has_many :schools_admins, class_name: 'SchoolsAdmins'

  validate :lower_grade_within_bounds, :upper_grade_within_bounds,
           :lower_grade_greater_than_upper_grade

  def grant_premium_to_users
    self.users.each{|u| Subscription.start_premium(u.id)}
  end

  def ulocal_to_school_type
    puts "Getting locale"
    puts ulocal
    data = {
      "11": "City, Large",
      "12": "City, Mid-size",
      "13": "City, Small",
      "21": "Suburb, Large",
      "22": "Suburb, Mid-size",
      "23": "Suburb, Small",
      "31": "Town, Fringe",
      "32": "Town, Distant",
      "33": "Town, Remote",
      "41": "Rural, Fringe",
      "42": "Rural, Distant"
    }
    data[ulocal.to_s.to_sym]
  end

  private

  def lower_grade_within_bounds
    errors.add(:lower_grade, 'must be between 0 and 12') unless (0..12).include?(self.lower_grade.to_i)
  end

  def upper_grade_within_bounds
    errors.add(:upper_grade, 'must be between 0 and 12') unless (0..12).include?(self.upper_grade.to_i)
  end

  def lower_grade_greater_than_upper_grade
    return true unless self.lower_grade && self.upper_grade
    errors.add(:lower_grade, 'must be less than or equal to upper grade') if self.lower_grade.to_i > self.upper_grade.to_i
  end
end
