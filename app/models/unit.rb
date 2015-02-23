class Unit < ActiveRecord::Base
  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.for_sections(section_ids, teacher)
    joins(:classroom_activities => [:classroom, {:activity => {:topic => :section}}])
      .where('sections.id IN (?)', section_ids)
      .where('classrooms.teacher_id = ?', teacher.id).uniq
  end
end
