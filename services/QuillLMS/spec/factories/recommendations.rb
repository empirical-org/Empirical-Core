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
FactoryBot.define do
  factory :recommendation do
    name 'aa'
    activity
    unit_template
    category 0
  end
end
