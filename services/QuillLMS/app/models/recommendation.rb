class Recommendation < ActiveRecord::Base
  belongs_to :activity, dependent: :destroy
  belongs_to :unit_template
  validates :name, length: { minimum: 2, maximum: 150 }
  validates :name, uniqueness: true
  validates :name, :activity, :category, :unit_template, presence: true

  enum category: { independent_practice: 0, group_lesson: 1 }
end
