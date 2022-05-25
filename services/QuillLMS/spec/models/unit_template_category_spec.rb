# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_template_categories
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  primary_color   :string(255)
#  secondary_color :string(255)
#
require 'rails_helper'

RSpec.describe UnitTemplateCategory, type: :model do
  it { should have_many(:unit_templates) }
  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:name) }
end
