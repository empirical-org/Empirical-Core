class Classroom < ActiveRecord::Base
  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)
  include CheckboxCallback
  validates_uniqueness_of :code
  # validates_uniqueness_of :name, scope: :teacher_id # Can't guarantee Clever and Google obey this.
  # NO LONGER POSSIBLE WITH GOOGLE CLASSROOM : validates :grade, presence: true
  validates_presence_of :name
  default_scope { where(visible: true)}

  after_commit :hide_appropriate_classroom_activities

  has_many :classroom_activities
  has_many :activities, through: :classroom_activities
  has_many :units, through: :classroom_activities
  has_many :activity_sessions, through: :classroom_activities
  has_many :sections, through: :activities

  has_many :students_classrooms, foreign_key: 'classroom_id', dependent: :destroy, class_name: "StudentsClassrooms"
  has_many :students, through: :students_classrooms, source: :student, inverse_of: :classrooms, class_name: "User"

  has_many :classrooms_teachers
  has_many :teachers, through: :classrooms_teachers, source: :user

  before_validation :generate_code, if: Proc.new {|c| c.code.blank?}



  def unique_topic_count
    if unique_topic_count_array.any?
      val = unique_topic_count_array.first.topic_count
    else
      val = nil
    end
    val
  end

  def teacher
    self.classrooms_teachers.includes(:user).find_by_role('owner')&.teacher
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

  def archived_classrooms_manager
    {createdDate: self.created_at.strftime("%m/%d/%Y"), className: self.name, id: self.id, studentCount: self.students.count, classcode: self.code}
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
    if Classroom.unscoped.find_by_code(code) then generate_code end
  end

  def hide_appropriate_classroom_activities
    # on commit callback that checks if archived
    if self.visible == false
      hide_all_classroom_activities
      return
    end
  end

  def hide_all_classroom_activities
    ActivitySession.where(classroom_activity: self.classroom_activities).update_all(visible: false)
    self.classroom_activities.update_all(visible: false)
    SetTeacherLessonCache.perform_async(self.teacher_id)
    ids = Unit.find_by_sql("
      SELECT unit.id FROM units unit
      LEFT JOIN classroom_activities as ca ON ca.unit_id = unit.id AND ca.visible = true
      WHERE unit.visible = true
      AND ca.id IS null
      AND unit.user_id = #{self.teacher_id}")
    Unit.where(id: ids).update_all(visible: false)
  end

  private

  # Clever integration
  def clever_classroom
    Clever::Section.retrieve(self.clever_id, teacher.districts.first.token)
  end


end
