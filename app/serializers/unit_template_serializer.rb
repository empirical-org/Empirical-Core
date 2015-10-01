class UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :time, :unit_template_category_id, :grades
  has_many :activities

end
