class Classroom < ActiveRecord::Base
  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)

  validates_uniqueness_of :code
  validates_uniqueness_of :name, scope: :teacher_id
  validates :grade, presence: true
  validates_presence_of :name
  default_scope { where(visible: true)}


  has_many :units

  has_many :classroom_activities
  has_many :activities, through: :classroom_activities
  has_many :activity_sessions, through: :classroom_activities
  has_many :sections, through: :activities

  has_many :students, -> { where role: 'student' }, foreign_key: 'classcode', class_name: 'User', primary_key: 'code'
  belongs_to :teacher, class_name: 'User'

  before_validation :generate_code, if: Proc.new {|c| c.code.blank?}


  def x
    c = self
    if teacher.present?
      "#{c.id},#{c.name},#{c.code},#{c.teacher.name},#{c.teacher.email},#{teacher.ip_address}"
    else
      "#{c.id},#{c.name},#{c.code},,,"
    end
  end

  def unique_topic_count
    if unique_topic_count_array.any?
      val = unique_topic_count_array.first.topic_count
    else
      val = nil
    end
    val
  end

  def unique_topic_count_array
    filters = {}
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(teacher).results(filters)
    ActivitySession.from_cte('best_activity_sessions', best_activity_sessions)
      .select("COUNT(DISTINCT(activities.topic_id)) as topic_count")
      .joins('JOIN activities ON activities.id = best_activity_sessions.activity_id')
      .joins('JOIN classroom_activities ON classroom_activities.id = best_activity_sessions.classroom_activity_id')
      .where('classroom_activities.classroom_id = ?', id)
      .group('classroom_activities.classroom_id')
      .order('')
  end

  def self.setup_from_clever(section, teacher)
    c = Classroom.where(clever_id: section.id).includes(:units).first_or_initialize

    c.update_attributes(
      name: section.name,
      teacher: teacher,
      grade: section.grade
    )

    c.import_students!

    c
  end

  def import_students!
    clever_students = clever_classroom.students

    existing_student_ids = self.students.pluck(&:clever_id).uniq.compact
    students_to_add = clever_students.reject {|s| existing_student_ids.include?(s.id) }
    new_students = students_to_add.collect {|s| User.create_from_clever({info: s}, 'student')}

    self.students << new_students
  end

  def classroom_activity_for activity
    classroom_activities.where(activity_id: activity.id).first
  end

  def generate_code
    self.code = NameGenerator.generate
    if Classroom.find_by_code(code) then generate_code end
  end

  private

  # Clever integration
  def clever_classroom
    Clever::Section.retrieve(self.clever_id, teacher.districts.first.token)
  end


end
