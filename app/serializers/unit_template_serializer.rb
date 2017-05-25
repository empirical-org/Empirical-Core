class UnitTemplateSerializer < ActiveModel::Serializer
  attributes :id, :name, :problem, :summary, :teacher_review, :time, :grades, :order_number, :number_of_standards, :activity_info, :author, :unit_template_category, :activities

  def number_of_standards
    section_ids = []
    object.activities.each do |act|
      section_ids << act.topic.section_id
    end
    section_ids.uniq.count
  end

  def unit_template_category
    cat = object.unit_template_category
    {primary_color: cat.primary_color,
    secondary_color: cat.secondary_color}
  end

  def author
    {
      name: object.author.name,
      avatar_url: object.author.avatar.url(:thumb)
    }
  end

  # def classification
  #   {
  #
  #   }
  # end

  def activities
    activities = []
    object.activities.each do |act|
      activity = { id: act.id, name: act.name, flags: act.flags }
      activities.push(activity)
    end
    activities
  end

end
