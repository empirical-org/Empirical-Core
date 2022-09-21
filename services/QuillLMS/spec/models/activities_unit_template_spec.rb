# frozen_string_literal: true

# == Schema Information
#
# Table name: activities_unit_templates
#
#  order_number     :integer
#  activity_id      :integer          not null
#  unit_template_id :integer          not null
#
# Indexes
#
#  aut  (activity_id,unit_template_id)
#  uta  (unit_template_id,activity_id)
#
require 'rails_helper'

describe ActivitiesUnitTemplate do
  it { should belong_to :unit_template }
  it { should belong_to :activity }
end
