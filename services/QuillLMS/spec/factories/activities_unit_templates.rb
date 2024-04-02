# frozen_string_literal: true

# == Schema Information
#
# Table name: activities_unit_templates
#
#  id               :integer          not null, primary key
#  order_number     :integer
#  activity_id      :integer          not null
#  unit_template_id :integer          not null
#
# Indexes
#
#  aut  (activity_id,unit_template_id)
#  uta  (unit_template_id,activity_id)
#
FactoryBot.define do
  factory :activities_unit_template do
    unit_template { create(:unit_template) }
    activity { create(:activity) }
  end
end
