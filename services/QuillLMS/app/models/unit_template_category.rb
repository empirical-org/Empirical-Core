# == Schema Information
#
# Table name: unit_template_categories
#
#  id              :integer          not null, primary key
#  name            :string
#  primary_color   :string
#  secondary_color :string
#
class UnitTemplateCategory < ActiveRecord::Base
  has_many :unit_templates, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end
