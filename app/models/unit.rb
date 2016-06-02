class Unit < ActiveRecord::Base

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}








end
