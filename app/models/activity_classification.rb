class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy
  has_many :concept_results

  validates :key, uniqueness: true, presence: true


  def self.diagnostic
    ActivityClassification.find_by_key "diagnostic"
  end

  def self.types_teacher_has_assigned(teacher_id)
    # TODO: figure out how to do another level of joins and
    # so that we can start this with the teacher id and only
    # do one db hit.
    classroom_ids = Classroom.where(teacher_id: current_user.id).ids
    ActivityClassification.distinct.joins(activities: :classroom_activities).where('classroom_activities.classroom_id IN (?)', classroom_ids).ids
  end

end
