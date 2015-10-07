class Cms::UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :author_id, :description, :time, :unit_template_category_id, :grades
  has_many :activities

end
