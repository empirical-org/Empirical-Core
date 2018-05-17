class UnitTemplateCategory < ActiveRecord::Base
  has_many :unit_templates, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end
