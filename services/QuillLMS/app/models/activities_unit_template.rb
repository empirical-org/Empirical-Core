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
class ActivitiesUnitTemplate < ApplicationRecord
  belongs_to :unit_template
  belongs_to :activity
end
