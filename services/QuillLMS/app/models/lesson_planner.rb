class LessonPlanner < Hash
  attr_reader :classroom

  def initialize classroom
    @classroom = classroom
  end

  def build
    (Activity.all - classroom.activities).each do |activity|
      self[activity.topic.section.position] ||= {}
      self[activity.topic.section.position][activity.topic.section.name] ||= {}
      self[activity.topic.section.position][activity.topic.section.name][activity.topic.name] ||= []
      self[activity.topic.section.position][activity.topic.section.name][activity.topic.name] << activity
    end
  end

  def load
    map.to_a.sort{|a,b| a.first <=> b.first}.map(&:last).map(&:to_a).map(&:first)
  end
end
