class Classroom < ActiveRecord::Base
  validates_uniqueness_of :code

  has_many :units do
    def create_next
      create(name: "Unit #{@association.owner.units.count + 1}")
    end
  end

  has_many :classroom_activities
  has_many :activities, through: :classroom_activities
  has_many :activity_sessions, through: :classroom_activities
  has_many :sections, through: :activities

  has_many :students, -> { where role: 'student' }, foreign_key: 'classcode', class_name: 'User', primary_key: 'code'
  belongs_to :teacher, class_name: 'User'

  before_validation :generate_code

  after_save do
    StudentProfileCache.invalidate(students)
  end

  def classroom_activity_for activity
    classroom_activities.where(activity_id: activity.id).first
  end

private

  def generate_code
    self.code = NameGenerator.generate
    if Classroom.find_by_code(code) then generate_code end
  end
end
