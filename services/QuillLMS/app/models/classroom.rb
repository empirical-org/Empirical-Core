class Classroom < ActiveRecord::Base
  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)
  validates_uniqueness_of :code
  validates_presence_of :name
  default_scope { where(visible: true)}

  after_commit :hide_appropriate_classroom_units

  has_many :classroom_units
  has_many :units, through: :classroom_units
  has_many :unit_activities, through: :units
  has_many :activities, through: :unit_activities
  has_many :activity_sessions, through: :classroom_units
  has_many :sections, through: :assign_activities
  has_many :coteacher_classroom_invitations

  has_many :students_classrooms, foreign_key: 'classroom_id', dependent: :destroy, class_name: "StudentsClassrooms"
  has_many :students, through: :students_classrooms, source: :student, inverse_of: :classrooms, class_name: "User"

  has_many :classrooms_teachers, foreign_key: 'classroom_id'
  has_many :teachers, through: :classrooms_teachers, source: :user

  before_validation :set_code, if: Proc.new {|c| c.code.blank?}

  def self.create_with_join(classroom_attributes, teacher_id, role='owner')
    classroom = Classroom.create(classroom_attributes)
    if classroom.valid?
      ClassroomsTeacher.create(user_id: teacher_id, classroom_id: classroom.id, role: role)
    end
    classroom
  end

  def units_json
    units.select('units.id AS value, units.name').distinct.order('units.name').as_json(except: :id)
  end

  def unique_topic_count
    if unique_topic_count_array.any?
      val = unique_topic_count_array.first.topic_count
    else
      val = nil
    end
    val
  end

  def owner
    self.classrooms_teachers.includes(:user).find_by_role('owner')&.teacher
  end

  def coteachers
    self.classrooms_teachers.includes(:user).where(role: 'coteacher').map(&:teacher)
  end

  def unique_topic_count_array
    filters = {}
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(owner).results(filters)
    ActivitySession.from_cte('best_activity_sessions', best_activity_sessions)
      .select("COUNT(DISTINCT(activities.topic_id)) as topic_count")
      .joins('JOIN activities ON activities.id = best_activity_sessions.activity_id')
      .joins('JOIN classroom_units ON classroom_units.id = best_activity_sessions.classroom_unit_id')
      .where('classroom_units.classroom_id = ?', id)
      .group('classroom_units.classroom_id')
      .order('')
  end

  def self.setup_from_clever(section, teacher)
    c = Classroom.where(clever_id: section.id).includes(:units).first_or_initialize
    c.update_attributes(
      name: section.name,
      grade: section.grade
    )
    ClassroomsTeacher.find_or_create_by(user: teacher, role: 'owner', classroom: c)
    c.import_students!
    c
  end

  def archived_classrooms_manager
    coteachers = self.coteachers.length > 0 ? self.coteachers.map { |ct| { name: ct.name, id: ct.id, email: ct.email } } : []
    {createdDate: self.created_at.strftime("%m/%d/%Y"), className: self.name, id: self.id, studentCount: self.students.count, classcode: self.code, ownerName: self.owner.name, from_google: !!self.google_classroom_id, coteachers: coteachers}
  end

  def import_students!
    clever_students = clever_classroom.students

    existing_student_ids = self.students.pluck(&:clever_id).uniq.compact
    students_to_add = clever_students.reject {|s| existing_student_ids.include?(s.id) }
    new_students = students_to_add.collect {|s| User.create_from_clever({info: s}, 'student')}

    self.students << new_students
  end

  def set_code
    self.code = Classroom.generate_unique_code
  end

  def self.generate_unique_code
    code = NameGenerator.generate
    if Classroom.unscoped.find_by_code(code)
       generate_unique_code
    else
      code
    end
  end

  def hide_appropriate_classroom_units
    # on commit callback that checks if archived
    if self.visible == false
      hide_all_classroom_units
      return
    end
  end

  def hide_all_classroom_units
    ActivitySession.where(classroom_unit: self.classroom_units).update_all(visible: false)
    self.classroom_units.update_all(visible: false)
    SetTeacherLessonCache.perform_async(self.owner.id)
    ids = Unit.find_by_sql("
      SELECT unit.id FROM units unit
      LEFT JOIN classroom_units as cu ON cu.unit_id = unit.id AND cu.visible = true
      WHERE unit.visible = true
      AND cu.id IS null
      AND unit.user_id = #{self.owner.id}")
    Unit.where(id: ids).update_all(visible: false)
  end

  def with_students
    self.attributes.merge({students: self.students})
  end

  def with_students_ids
    self.attributes.merge({student_ids: self.students.ids})
  end

  private

  # Clever integration
  def clever_classroom
    Clever::Section.retrieve(self.clever_id, teacher.districts.first.token)
  end



end
