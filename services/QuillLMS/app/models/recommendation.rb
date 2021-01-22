# == Schema Information
#
# Table name: recommendations
#
#  id               :integer          not null, primary key
#  category         :integer          not null
#  name             :string           not null
#  order            :integer          default(0), not null
#  activity_id      :integer          not null
#  unit_template_id :integer          not null
#
# Indexes
#
#  index_recommendations_on_activity_id       (activity_id)
#  index_recommendations_on_unit_template_id  (unit_template_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
class Recommendation < ActiveRecord::Base
  belongs_to :activity
  belongs_to :unit_template
  has_many :criteria, dependent: :destroy
  validates :name, length: { minimum: 2, maximum: 150 }
  validates :name, :activity, :category, :unit_template, presence: true

  default_scope { order(order: :asc) }

  enum category: { independent_practice: 0, group_lesson: 1 }
end
