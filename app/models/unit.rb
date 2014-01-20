class Unit < ActiveRecord::Base
  belongs_to :classroom
  has_many :classroom_activities
  has_many :activities, through: :classroom_activities
end