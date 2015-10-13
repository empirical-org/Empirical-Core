class UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :time, :grades, :number_of_standards
  has_many :activities
  has_one :unit_template_category
  has_one :author

  def number_of_standards
    object.activities
          .map(&:topic)
          .map(&:section_id)
          .uniq
          .count
  end
end
