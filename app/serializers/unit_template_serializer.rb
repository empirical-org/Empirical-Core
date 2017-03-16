class UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :problem, :summary, :teacher_review, :time, :grades, :order_number, :number_of_standards, :activity_info
  has_many :activities
  has_one :unit_template_category
  has_one :author

  def number_of_standards
    section_ids = []
    object.activities.each do |act|
      section_ids << act.topic.section_id
    end
    section_ids.uniq.count
  end
end
