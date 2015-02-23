class Classroom < ActiveRecord::Base
  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)

  validates_uniqueness_of :code
  validates_uniqueness_of :name, scope: :teacher_id, message: "A classroom called %{value} already exists. Please rename this classroom to a different name."

  validates :grade, presence: true, inclusion: { in: Classroom::GRADES, message: "%{value} is not a valid grade" }
  validates_presence_of :name


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

  before_validation :generate_code, if: Proc.new {|c| c.code.blank?}

  after_save do
    StudentProfileCache.invalidate(students)
  end

  def x
    c = self
    if teacher.present?
      "#{c.id},#{c.name},#{c.code},#{c.teacher.name},#{c.teacher.email},#{teacher.ip_address}"
    else
      "#{c.id},#{c.name},#{c.code},,,"
    end
  end

  def self.for_progress_report(section_ids, teacher, filters)
    q = joins(:classroom_activities => [:activity_sessions, {:activity => {:topic => :section}}])
      .where('sections.id IN (?)', section_ids)
      .where('classrooms.teacher_id = ?', teacher.id).uniq

    if filters[:student_id].present?
      q = q.where('activity_sessions.user_id = ?', filters[:student_id])
    end

    if filters[:unit_id].present?
      q = q.where('classroom_activities.unit_id = ?', filters[:unit_id])
    end

    q
  end

  def self.setup_from_clever(section)
    c = Classroom.where(clever_id: section.id).includes(:units).first_or_initialize

    c.update_attributes(
      name: section.name,
      teacher: User.teacher.where(clever_id: section.teacher).first,
      grade: section.grade
    )
    c.units.create_next if c.units.empty?

    c
  end

  def classroom_activity_for activity
    classroom_activities.where(activity_id: activity.id).first
  end


  def generate_code
    self.code = NameGenerator.generate
    if Classroom.find_by_code(code) then generate_code end
  end

end
