class UnitTemplatePseudoSerializer
  # attributes :id, :name, :problem, :summary, :teacher_review, :time, :grades, :order_number, :number_of_standards, :activity_info, :author, :unit_template_category, :activities, :topics

  def initialize(unit_template, flag=nil)
    @unit_template = unit_template
  end

  def get_data
    ut = @unit_template
    {
      id: ut.id,
      name: ut.name,
      problem: ut.problem,
      summary: ut.summary,
      teacher_review: ut.teacher_review,
      time: ut.time,
      grades: ut.grades,
      order_number: ut.order_number,
      number_of_standards: number_of_standards,
      activity_info: ut.activity_info,
      author: author,
      unit_template_category: unit_template_category,
      activities: activities
    }
  end

  def number_of_standards
    section_ids = []
    @unit_template.activities.each do |act|
      section_ids << act.topic.section_id
    end
    section_ids.uniq.count
  end

  def unit_template_category
    cat = @unit_template.unit_template_category
    {
      primary_color: cat.primary_color,
      secondary_color: cat.secondary_color,
      name: cat.name,
      id: cat.id
    }
  end

  def author
    author = @unit_template.author
    {
      name: author.name,
      avatar_url: author.avatar.url(:thumb)
    }
  end

  def activities
    activities = []
    @unit_template.activities.each do |act|
      activity = {
        id: act.id,
        name: act.name,
        flags: act.flags,
        topic: topic(act),
        classification: {key: act.classification.key}
        }
      activities.push(activity)
    end
    activities
  end

  def topic(act)
      topic = act.topic
      {
        id: topic.id,
        name: topic.name,
        topic_category: topic_category(topic)
      }
  end

  def topic_category(topic)
    tc = topic.topic_category
    {
      id: tc.id,
      name: tc.name
    }
  end


end
