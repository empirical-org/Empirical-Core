class Unit < ActiveRecord::Base

  belongs_to :classroom
  belongs_to :user
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}

  validates :name, uniqueness: { scope: :user,
    message: "Unit name must be unique." }

end
