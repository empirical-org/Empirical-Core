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
class UnitTemplateCategory < ApplicationRecord
  has_many :unit_templates, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end
